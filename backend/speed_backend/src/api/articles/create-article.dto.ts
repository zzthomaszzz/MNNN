import { Date } from 'mongoose';

export class CreateArticleDto {
  // Articles Information
  title: string;
  author: string;
  journal_name: string;
  publication_date: Date;
  doi: string;

  // Submission Information
  submission_date?: Date | string
  summary_brief: string;
}