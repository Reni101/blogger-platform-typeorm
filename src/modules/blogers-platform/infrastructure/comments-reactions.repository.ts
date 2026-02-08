import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentReaction } from '../domain/comment-reaction.entity';
import { CommentReactionDto } from '../domain/dto/comment-reaction.dto';

@Injectable()
export class CommentsReactionsRepository {
    constructor(
        @InjectRepository(CommentReaction)
        private commentReactionsRepository: Repository<CommentReaction>,
    ) {}

    async findByUserIdCommentId(userId: number, commentId: number) {
        return this.commentReactionsRepository.findOneBy({
            userId,
            commentId,
        });
    }
    async createReaction(dto: CommentReactionDto) {
        const reaction = this.commentReactionsRepository.create({
            userId: dto.userId,
            commentId: dto.commentId,
            status: dto.status,
        });
        await this.commentReactionsRepository.save(reaction);
    }
    async deleteReaction(id: number) {
        return this.commentReactionsRepository.delete(id);
    }
    async save(r: CommentReaction) {
        return this.commentReactionsRepository.save(r);
    }
}
