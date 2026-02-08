import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

export class UpdateCommentCommand {
    constructor(
        public dto: { commentId: number; content: string; userId: number },
    ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
    constructor(private commentsRepository: CommentsRepository) {}

    async execute({ dto }: UpdateCommentCommand) {
        const comment = await this.commentsRepository.findByIdOrThrow(
            dto.commentId,
        );
        if (+comment.userId !== +dto.userId) {
            throw new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'The comment does not belong to the user',
            });
        }

        comment.content = dto.content;
        await this.commentsRepository.save(comment);
    }
}
