import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Article } from './article.schema';
import { Moderator } from './moderator.schema';

@Schema({ timestamps: true })
export class RejectedArticle {
  @Prop({ type: Types.ObjectId, ref: 'Article' })
  originalArticle: Types.ObjectId;
  //upload all the files to same dattabase,show different articles by their stats. E.g. pending, approved, rejected
  @Prop({ required: true })
  rejectionReason: string;

  @Prop({ type: Types.ObjectId, ref: 'Moderator' })
  rejectedBy: Types.ObjectId;
}

export const RejectedArticleSchema = SchemaFactory.createForClass(RejectedArticle);
export type RejectedArticleDocument = RejectedArticle & Document;