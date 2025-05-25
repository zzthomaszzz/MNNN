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

@Controller('articles')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    async create(@Body() createArticleDto: CreateArticleDto) {
        try {
            const articleData = {
                ...createArticleDto,
                publication_date: createArticleDto.publication_date,
                submission_date: createArticleDto.submission_date || new Date()
            };
            await this.articleService.create(createArticleDto);
            return { 
                statusCode: HttpStatus.CREATED,
                message: "Article created successfully"};
        } catch (e){
            throw new HttpException(
                { 
                    status: HttpStatus.BAD_REQUEST,
                    error: "Article creation failed",
                    details: e.message
                },
                HttpStatus.BAD_REQUEST,
                {cause: e},
            );
        }
    }

    @Get('/')
    async findAll() {
        try {
            return this.articleService.findAll();
        } catch(e) {
        throw new HttpException(
            {
                status: HttpStatus.NOT_FOUND,
                error: "Not articles found",
                details:e.message
            },
            HttpStatus.NOT_FOUND,
            { cause: e},
            );
        }
    }
}