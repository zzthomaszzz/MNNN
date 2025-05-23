/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { Article } from "./article.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose"; 
import { CreateArticleDto } from "./create-article.dto";

@Injectable()
export class ArticleService {
    constructor(@InjectModel(Article.name) private articleModel: Model<Article>) {}

    test(): string{
        return "Testing for Article Service";
    }

    async create(createArticleDto: CreateArticleDto): Promise<Article> {
        return await this.articleModel.create(createArticleDto);
    }

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find().exec();
    }

}