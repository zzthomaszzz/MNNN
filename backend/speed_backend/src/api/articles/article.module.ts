/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { ArticleController } from "./article.controller";
import { ArticleService } from "./article.service";
import { MongooseModule } from "@nestjs/mongoose";  
import { Article, ArticleSchema } from "./article.schema";
import { Moderator, ModeratorSchema } from './moderator.schema';
import { RejectedArticle, RejectedArticleSchema } from './rejected-article.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema},{ name: RejectedArticle.name, schema: RejectedArticleSchema },
        {name:Moderator.name, schema: ModeratorSchema }])],
    controllers: [ArticleController],
    providers: [ArticleService],

})

export class ArticleModule {}