import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetBlogsQueryParams } from './input-dto/blog/get-blogs-query-params.input-dto';

import { BlogViewDto } from './view-dto/blogs.view-dto';
import { GetPostsQueryParams } from './input-dto/post/get-posts-query-params.input-dto';
import { ExtractUserIfExistsFromRequest } from '../../user-accounts/guards/decorators/extract-user-if-exists-from-request.decorator';
import { UserContextDto } from '../../user-accounts/guards/dto/user-context.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtOptionalAuthGuard } from '../../user-accounts/guards/bearer/jwt-optional-auth.guard';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';

@Controller('blogs')
export class BlogsController {
    constructor(
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    async getBlogs(@Query() query: GetBlogsQueryParams) {
        return this.blogsQueryRepository.getBlogs(query);
    }

    @Get(':id')
    async getById(@Param('id') id: number): Promise<BlogViewDto> {
        return this.blogsQueryRepository.getByIdOrThrow(id);
    }
    @ApiBearerAuth()
    @Get(':id/posts')
    @UseGuards(JwtOptionalAuthGuard)
    async getPostByBlogId(
        @Param('id') blogId: number,
        @Query() query: GetPostsQueryParams,
        @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
    ) {
        await this.blogsQueryRepository.getByIdOrThrow(blogId);
        return this.postsQueryRepository.getPosts(query, {
            blogId,
            userId: user?.id,
        });
    }
}
