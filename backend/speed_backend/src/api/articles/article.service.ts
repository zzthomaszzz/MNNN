/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Article } from "./article.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"; 
import { CreateArticleDto } from "./create-article.dto";
import { RejectArticleDto } from "./reject-article.dto";
@Injectable()
export class ArticleService {
    constructor(@InjectModel(Article.name) private articleModel: Model<Article>,
        @InjectModel(RejectedArticle.name) private rejectedArticleModel: Model<RejectedArticle>
    ) {}
    
    test(): string{
        return "Testing for Article Service";
    }

    async create(createArticleDto: CreateArticleDto): Promise<void> {
        const newArticle=new this.articleModel({
            ...createArticleDto,
            status: 'pending',
        })
        await newArticle.save();
    }

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find().exec();
    }
    //update article state
    async rejectArticle(articleId: string, moderatorId: string, rejectArticleDto: RejectArticleDto): Promise<{ article: Article; rejectedRecord: RejectedArticle }> {
        const updatedArticle = await this.articleModel.findByIdAndUpdate(
            articleId,
            { 
                status: 'rejected',
                moderatedBy: moderatorId,
                moderatedAt: new Date() 
            },
            { new: true }
        ).exec();

        if (!updatedArticle) {
            throw new Error('Article not found');
        }
        //create a rejected article record
         const rejectedRecord = await this.rejectedArticleModel.create({
            originalArticle: articleId,
            rejectionReason: rejectArticleDto.rejectionReason,
            rejectedBy: moderatorId
        });

        return {
            article: updatedArticle,
            rejectedRecord
        };
    }

}