import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostReaction } from '../domain/post-reaction.entity';
import { PostReactionDto } from '../domain/dto/post-reaction.dto';

@Injectable()
export class PostsReactionsRepository {
    constructor(
        @InjectRepository(PostReaction)
        private postReactionsRepository: Repository<PostReaction>,
    ) {}

    async findByUserIdPostId(userId: number, postId: number) {
        return this.postReactionsRepository.findOneBy({
            userId,
            postId,
        });
    }
    async createReaction(dto: PostReactionDto) {
        const reaction = this.postReactionsRepository.create({
            userId: dto.userId,
            postId: dto.postId,
            status: dto.status,
        });
        await this.postReactionsRepository.save(reaction);
    }
    async deleteReaction(id: number) {
        return this.postReactionsRepository.delete(id);
    }
    async save(r: PostReaction) {
        return this.postReactionsRepository.save(r);
    }
}
