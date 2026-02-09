import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentDto } from '../../domain/dto/create-comment.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentViewDto } from '../../api/view-dto/comment.view-dto';
import { CommentsQueryRepository } from '../../infrastructure/comments-query.repository';

export class CreateCommentCommand {
    constructor(public dto: CreateCommentDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<CreateCommentCommand> {
    constructor(
        private commentsRepository: CommentsRepository,
        private commentsQueryRepository: CommentsQueryRepository,
        private postsRepository: PostsRepository,
    ) {}

    async execute({ dto }: CreateCommentCommand): Promise<CommentViewDto> {
        await this.postsRepository.findByIdOrThrow(dto.postId);

        const commentId = await this.commentsRepository.createComment(dto);
        return this.commentsQueryRepository.getByIdOrThrow(commentId);
    }
}
