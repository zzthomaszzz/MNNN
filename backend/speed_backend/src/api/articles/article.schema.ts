/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {

    // Articles Information
    @Prop({ required: true })
    title: string;
    
    @Prop({ required: true })
    author: string;
    
    @Prop({ required: true })
    journal_name: string;

    @Prop({type: Date, required: true })
    publication_date: Date;

    @Prop({ required: true })
    volume: string;

    @Prop({ required: true })
    number: string;

    @Prop({ required: true })
    pages: string;

    @Prop({ required: true })
    doi: string;

    // Submission Information
    @Prop({ type: Date, required: true })
    submission_date: Date;

    @Prop({ required: true })
    summary_brief: string;

    @Prop({ default: false })
    moderation_pass: boolean;

    @Prop({ default: false })
    analysis_pass: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);