import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { CreateCommentDto } from '../domain/dto/create-comment.dto';

@Injectable()
export class CommentsRepository {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
    ) {}
    async createComment(dto: CreateCommentDto) {
        const comment = this.commentsRepository.create();
        comment.content = dto.content;
        comment.postId = dto.postId;
        comment.userId = dto.userId;

        await this.commentsRepository.save(comment);

        return comment.id;
    }

    async findById(id: number, postId: number) {
        return this.commentsRepository.findOne({ where: { id, postId } });
    }

    async findByIdOrThrow(id: number, postId: number) {
        const blog = await this.findById(id, postId);
        if (!blog) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'comment not found',
            });
        }
        return blog;
    }

    async save(comment: Comment) {
        return this.commentsRepository.save(comment);
    }
    async delete(commentId: number) {
        return this.commentsRepository.delete(commentId);
    }
}
