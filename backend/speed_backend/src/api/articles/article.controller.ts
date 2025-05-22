/* eslint-disable prettier/prettier */
import {
Body,
Controller,
Get,
HttpException,
HttpStatus,
Post,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './create-article.dto';
import { error } from 'console';

@Controller('api/articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get('/test')
    test(){
        return this.articleService.test();
    }

    @Post("/")
    async create(@Body() createArticleDto: CreateArticleDto) {
        try {
            await this.articleService.create(createArticleDto);
            return { message: "Article created successfully"};
        } catch {
            throw new HttpException(
                { 
                    status: HttpStatus.BAD_REQUEST,
                    error: "Article creation failed",
                },
                HttpStatus.BAD_REQUEST,
                {cause: error},
            );
        }
    }
}
