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

    //Removed the required property for testing purposes
    // @Prop({ type: Date, required: true })
    @Prop({type: Date })
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

    //Removed the required property for testing purposes
    // @Prop({ type: Date, required: true })
    @Prop({ type: Date })
    submission_date: Date;

    @Prop({ required: true })
    summary_brief: string;

    @Prop({ default: 'pending', enum: ['pending', 'approved', 'rejected'] })
    status: string;

}

export const ArticleSchema = SchemaFactory.createForClass(Article);