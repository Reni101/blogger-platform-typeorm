import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
    ) {}

    async findById(id: number, userId?: number) {
        const comment = await this.commentsRepository.findOne({
            where: { id },
            relations: { user: true },
            select: { user: { login: true, id: true } },
        });
        if (!comment) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'comment not found',
            });
        }
        return comment;
    }
}
