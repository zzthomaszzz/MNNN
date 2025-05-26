/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
    @Prop({ required: true })
    title: string;
    
    @Prop({ required: true })
    author: string;
    
    @Prop({ required: true })
    journal_name: string;

    @Prop({ type: Date })
    publication_date: Date;

    @Prop({ required: true })
    doi: string;

    @Prop({ type: Date })
    submission_date: Date;

    @Prop({ type: String, required: true })
    summary_brief: string;

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
    status: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);