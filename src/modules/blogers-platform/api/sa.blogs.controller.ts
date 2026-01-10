import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { BlogViewDto, PaginatedBlogsViewDto } from './view-dto/blogs.view-dto';
import { ApiSecurity } from '@nestjs/swagger';
import { BasicAuthGuard } from '../../user-accounts/guards/basic/bacis-auth.guard';
import { CreateBlogInputDto } from './input-dto/blog/create-blog.input-dto';
import { CreateBlogCommand } from '../aplication/use-cases/create-blog.use-case';
import { GetBlogsQueryParams } from './input-dto/blog/get-blogs-query-params.input-dto';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { UpdateBlogInputDto } from './input-dto/blog/update-blog.input-dto';
import { UpdateBlogCommand } from '../aplication/use-cases/update-blog.use-case';
import { DeleteBlogCommand } from '../aplication/use-cases/delete-blog.use-case';
import { CreatePostInputDto } from './input-dto/post/create-post.input-dto';
import { PaginatedPostsViewDto } from './view-dto/posts.view-dto';
import { CreatePostCommand } from '../aplication/use-cases/create-post.use-case';
import { GetPostsQueryParams } from './input-dto/post/get-posts-query-params.input-dto';
import { PostsQueryRepository } from '../infrastructure/posts-query.repository';
import { UpdatePostInputDto } from './input-dto/post/update-post.input-dto';
import { UpdatePostCommand } from '../aplication/use-cases/update-post.use-case';
import { DeletePostCommand } from '../aplication/use-cases/delete-post.use-case';

@ApiSecurity('basic')
@Controller('sa/blogs')
@UseGuards(BasicAuthGuard)
export class SaBlogsController {
    constructor(
        private commandBus: CommandBus,
        private blogsQueryRepository: BlogsQueryRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    @Get()
    async getBlogs(
        @Query() query: GetBlogsQueryParams,
    ): Promise<PaginatedBlogsViewDto> {
        return this.blogsQueryRepository.getBlogs(query);
    }

    @Post()
    async createBlog(@Body() dto: CreateBlogInputDto) {
        return this.commandBus.execute<CreateBlogCommand, BlogViewDto>(
            new CreateBlogCommand(dto),
        );
    }
    @Put(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updateBlog(
        @Param('id') blogId: number,
        @Body() dto: UpdateBlogInputDto,
    ) {
        return this.commandBus.execute<UpdateBlogCommand, void>(
            new UpdateBlogCommand(dto, +blogId),
        );
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteBlog(@Param('id') blogId: number) {
        return this.commandBus.execute<DeleteBlogCommand, void>(
            new DeleteBlogCommand(blogId),
        );
    }

    @Post(':id/posts')
    async createPostByBlogId(
        @Param('id') blogId: string,
        @Body() dto: CreatePostInputDto,
    ) {
        return this.commandBus.execute<
            CreatePostCommand,
            PaginatedPostsViewDto
        >(new CreatePostCommand(dto, +blogId));
    }
    @Get(':id/posts')
    async getPostsByBlogId(
        @Query() query: GetPostsQueryParams,
        @Param('id') blogId: number,
    ) {
        return this.postsQueryRepository.getPosts(query, blogId);
    }

    @Put(':blogId/posts/:postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async updatePost(
        @Param('blogId') blogId: string,
        @Body() dto: UpdatePostInputDto,
        @Param('postId') postId: string,
    ) {
        return this.commandBus.execute<UpdatePostCommand, void>(
            new UpdatePostCommand(dto, +blogId, +postId),
        );
    }

    @Delete(':blogId/posts/:postId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePost(
        @Param('postId') postId: string,
        @Param('blogId') blogId: string,
    ) {
        return this.commandBus.execute<DeletePostCommand, void>(
            new DeletePostCommand(+postId, +blogId),
        );
    }
}
