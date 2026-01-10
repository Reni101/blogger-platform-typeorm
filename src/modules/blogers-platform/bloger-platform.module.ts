import { Module } from '@nestjs/common';
import { CreateBlogUseCase } from './aplication/use-cases/create-blog.use-case';
import { SaBlogsController } from './api/sa.blogs.controller';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './domain/blog.entity';
import { BlogsQueryRepository } from './infrastructure/blogs-query.repository';
import { UpdateBlogUseCase } from './aplication/use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from './aplication/use-cases/delete-blog.use-case';

const useCases = [
    CreateBlogUseCase,
    UpdateBlogUseCase,
    DeleteBlogUseCase,
    // CreatePostUseCase,
    // UpdatePostUseCase,
    // DeletePostUseCase,
    // CreateCommentUseCase,
    // UpdateCommentUseCase,
    // DeleteCommentUseCase,
    //
    // ToggleLikeCommentUseCase,
    // ToggleLikePostsUseCase,
];

@Module({
    imports: [TypeOrmModule.forFeature([Blog])],
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
        //
        // PostsQueryRepository,
        // PostsRepository,
        //
        // CommentsQueryRepository,
        // CommentsRepository,
        //
        // CommentsReactionsRepository,
        // PostsReactionsRepository,
    ],
})
export class BlogPlatformModule {}
