import { Module } from '@nestjs/common';
import { CreateBlogUseCase } from './aplication/use-cases/create-blog.use-case';
import { SaBlogsController } from './api/sa.blogs.controller';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogsQueryRepository } from './infrastructure/blogs-query.repository';
import { UpdateBlogUseCase } from './aplication/use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from './aplication/use-cases/delete-blog.use-case';
import { Post } from './domain/post.entity';
import { CreatePostUseCase } from './aplication/use-cases/create-post.use-case';
import { PostsRepository } from './infrastructure/posts.repository';
import { PostsQueryRepository } from './infrastructure/posts-query.repository';
import { UpdatePostUseCase } from './aplication/use-cases/update-post.use-case';
import { DeletePostUseCase } from './aplication/use-cases/delete-post.use-case';

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    CreatePostUseCase,
    UpdatePostUseCase,
    DeletePostUseCase,

    // CreateCommentUseCase,
    // UpdateCommentUseCase,
    // DeleteCommentUseCase,
    //
    // ToggleLikeCommentUseCase,
    // ToggleLikePostsUseCase,
];

@Module({
    imports: [TypeOrmModule.forFeature([Blog, Post])],
    controllers: [
        SaBlogsController,
        // BlogsController,
        // PostsController,
        // CommentsController,
    ],
    providers: [
        ...useCases,

        BlogsRepository,
        BlogsQueryRepository,

        PostsRepository,
        PostsQueryRepository,
        //
        // CommentsQueryRepository,
        // CommentsRepository,
        //
        // CommentsReactionsRepository,
        // PostsReactionsRepository,
    ],
})
export class BlogPlatformModule {}
