import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsReactionsRepository } from '../../infrastructure/posts-reactions.repository';
import { PostReactionDto } from '../../domain/dto/post-reaction.dto';

export class ToggleLikePostsCommand {
    constructor(public dto: PostReactionDto) {}
}

@CommandHandler(ToggleLikePostsCommand)
export class ToggleLikePostsUseCase implements ICommandHandler<ToggleLikePostsCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private postsReactionsRepository: PostsReactionsRepository,
    ) {}

    async execute({ dto }: ToggleLikePostsCommand) {
        await this.postsRepository.findByIdOrThrow(dto.postId);
        const reaction = await this.postsReactionsRepository.findByUserIdPostId(
            dto.userId,
            dto.postId,
        );

        if (!reaction && dto.status !== LikeStatusEnum.None) {
            await this.postsReactionsRepository.createReaction(dto);
            return;
        }

        if (reaction && dto.status === LikeStatusEnum.None) {
            await this.postsReactionsRepository.deleteReaction(reaction.id);
            return;
        }
        if (reaction && reaction.status !== dto.status) {
            reaction.status = dto.status;
            await this.postsReactionsRepository.save(reaction);
            return;
        }
    }
}
