import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

export class DeleteCommentCommand {
    constructor(public dto: { commentId: number; userId: number }) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
    constructor(private commentsRepository: CommentsRepository) {}

    async execute({ dto }: DeleteCommentCommand) {
        const comment = await this.commentsRepository.findByIdOrThrow(
            dto.commentId,
        );
        if (+comment.userId !== +dto.userId) {
            throw new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'The comment does not belong to the user',
            });
        }
        await this.commentsRepository.delete(dto.commentId);
    }
}
