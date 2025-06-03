
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '..\api\articles\article.schema.ts';
import { RejectedArticle, RejectedArticleDocument } from '..\api\articles\article.rejected-article.schema';
import { Moderator, ModeratorDocument } from '../schemas/moderator.schema';
import { EmailService } from './email.service';

export enum ModerationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Injectable()
export class ModerationService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(RejectedArticle.name) private rejectedArticleModel: Model<RejectedArticleDocument>,
    @InjectModel(Moderator.name) private moderatorModel: Model<ModeratorDocument>,
    private readonly emailService: EmailService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  //get all articles that are pending moderation
 async getModerationQueue(): Promise<ArticleDocument[]> {
    return this.articleModel.find({
      moderation_pass: false,
      $or: [
        { status: { $exists: false } },
        { status: ModerationStatus.PENDING }
      ]
    }).sort({ submission_date: 1 }).exec();
  }
  // Check if already in submissions
  async checkForDuplicates(article: Article): Promise<{ isDuplicate: boolean; reason?: string }> {
    
   if (article.doi) {
      const existingByDoi = await this.articleModel.findOne({ doi: article.doi }).exec();
      if (existingByDoi && existingByDoi._id.toString() !== article._id.toString()) {
        return { isDuplicate: true, reason: 'Duplicate DOI found' };
      }
    }

    const existingByDetails = await this.articleModel.findOne({
      title: article.title,
      author: article.author,
      journal_name: article.journal_name
    }).exec();

    if (existingByDetails && existingByDetails._id.toString() !== article._id.toString()) {
      return { isDuplicate: true, reason: 'Similar article already exists' };
    }


 

    // Check if already in rejected articles
   const rejected = await this.rejectedArticleModel.findOne({
      $or: [
        { doi: article.doi },
        { 
          title: article.title,
          author: article.author,
          journal_name: article.journal_name
        }
      ]
    }).exec();

    if (rejected) {
      return { isDuplicate: true, reason: 'This article was previously rejected' };
    }

    return { isDuplicate: false };
  }

  async moderateArticle(
    articleId: string,
    moderatorId: string,
    decision: ModerationStatus,
    rejectionReason?: string
  ): Promise<ArticleDocument> {
    const article = await this.articleModel.findById(articleId).exec();
    if (!article) {
      throw new Error('Article not found');
    }

    if (article.moderation_pass) {
      throw new Error('Article has already been moderated');
    }

    const moderator = await this.moderatorModel.findById(moderatorId).exec();
    if (!moderator) {
      throw new Error('Moderator not found');
    }

    if (decision === ModerationStatus.REJECTED && !rejectionReason) {
      throw new Error('Rejection reason is required when rejecting an article');
    }

    // Update article status
    article.moderation_pass = decision === ModerationStatus.APPROVED;
    article.status = decision;
    article.moderatedBy = moderator._id;

    //add the rejection reason if the article is rejected
    if (decision === ModerationStatus.REJECTED) {
       const rejectedArticle = new this.rejectedArticleModel({
        ...article.toObject(),
        _id: undefined, // Let MongoDB generate new _id
        rejectionReason,
        rejectedBy: moderator._id,
        rejectedAt: new Date()
      });
      await rejectedArticle.save();
    }

    const updatedArticle = await article.save();

   
    //nodify the moderator by email
     this.eventEmitter.emit('article.moderated', {
      articleId: updatedArticle.id,
      decision,
      rejectionReason,
      submitterEmail: updatedArticle.submitterEmail
    });

    return updatedArticle;


  }
async notifyModeratorsOfPendingArticles(): Promise<void> {
    const pendingCount = await this.articleModel.countDocuments({
      moderation_pass: false,
      $or: [
        { status: { $exists: false } },
        { status: ModerationStatus.PENDING }
      ]
    }).exec();

    if (pendingCount > 0) {
      const moderators = await this.moderatorModel.find().exec();
      const notificationPromises = moderators.map(moderator => 
        this.emailService.sendModerationNotification(moderator.email, pendingCount)
      );
      
      await Promise.all(notificationPromises);
    }
  }

  async getModerationStats(): Promise<{
    pending: number;
    approved: number;
    rejected: number;
    total: number;
  }> {
    const [pending, approved, rejected] = await Promise.all([
      this.articleModel.countDocuments({
        moderation_pass: false,
        $or: [
          { status: { $exists: false } },
          { status: ModerationStatus.PENDING }
        ]
      }).exec(),
      this.articleModel.countDocuments({ moderation_pass: true }).exec(),
      this.rejectedArticleModel.countDocuments().exec()
    ]);

    return {
      pending,
      approved,
      rejected,
      total: pending + approved + rejected
    };
  }
}