import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class DeletePostCommand {
    constructor(
        public postId: number,
        public blogId: number,
    ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private blogsRepository: BlogsRepository,
    ) {}

    async execute({ postId, blogId }: DeletePostCommand) {
        await this.blogsRepository.findByIdOrThrow(blogId);
        const post = await this.postsRepository.findByIdOrThrow(postId);
        await this.postsRepository.delete(post.id);
    }
}
