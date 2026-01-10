import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostInputDto } from '../../api/input-dto/post/create-post.input-dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsQueryRepository } from '../../infrastructure/posts-query.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { PostViewDto } from '../../api/view-dto/posts.view-dto';

export class CreatePostCommand {
    constructor(
        public dto: CreatePostInputDto,
        public blogId: number,
    ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
    constructor(
        private blogsRepository: BlogsRepository,
        private postsRepository: PostsRepository,
        private postsQueryRepository: PostsQueryRepository,
    ) {}

    async execute({ dto, blogId }: CreatePostCommand): Promise<PostViewDto> {
        await this.blogsRepository.findByIdOrThrow(blogId);
        const { id } = await this.postsRepository.createPost(dto, blogId);
        return this.postsQueryRepository.getByIdOrThrow({
            postId: id,
        });
    }
}
