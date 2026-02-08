import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsReactionsRepository } from '../../infrastructure/comments-reactions.repository';
import { CommentReactionDto } from '../../domain/dto/comment-reaction.dto';

export class ToggleLikeCommentCommand {
    constructor(public dto: CommentReactionDto) {}
}

@CommandHandler(ToggleLikeCommentCommand)
export class ToggleLikeCommentUseCase implements ICommandHandler<ToggleLikeCommentCommand> {
    constructor(
        private commentRepository: CommentsRepository,
        private reactionsRepository: CommentsReactionsRepository,
    ) {}

    async execute({ dto }: ToggleLikeCommentCommand) {
        await this.commentRepository.findByIdOrThrow(dto.commentId);

        const reaction = await this.reactionsRepository.findByUserIdCommentId(
            dto.userId,
            dto.commentId,
        );

        if (!reaction && dto.status !== LikeStatusEnum.None) {
            await this.reactionsRepository.createReaction(dto);
            return;
        }

        if (reaction && dto.status === LikeStatusEnum.None) {
            await this.reactionsRepository.deleteReaction(reaction.id);
            return;
        }

        if (reaction && reaction.status !== dto.status) {
            reaction.status = dto.status;
            await this.reactionsRepository.save(reaction);
            return;
        }
    }
}
