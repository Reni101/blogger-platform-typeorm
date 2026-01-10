import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostCommand {
    constructor(
        public postId: number,
        public blogId: number,
    ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
    constructor(private postsRepository: PostsRepository) {}

    async execute({ postId, blogId }: DeletePostCommand) {
        const post = await this.postsRepository.findByIdOrThrow(postId, blogId);
        await this.postsRepository.delete(post.id);
    }
}
