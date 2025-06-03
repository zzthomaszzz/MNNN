import { Date } from 'mongoose';

export class CreateArticleDto {
    // Articles Information
    title: string;
    author: string;
    journal_name: string;
    publication_date: Date;
    volume: string;
    number: string;
    pages: string;
    doi: string;

    // Submission Information
    submission_date: Date;
    summary_brief: string;
}