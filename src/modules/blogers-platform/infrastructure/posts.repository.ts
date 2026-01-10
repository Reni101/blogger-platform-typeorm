import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { CreatePostDto } from '../domain/dto/create-post.dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class PostsRepository {
    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
    ) {}
    async createPost(dto: CreatePostDto, blogId: number) {
        const post = this.postsRepository.create({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId,
        });
        await this.postsRepository.save(post);
        return post;
    }

    async findById(postId: number, blogId: number) {
        return this.postsRepository.findOne({ where: { id: postId, blogId } });
    }

    async findByIdOrThrow(postId: number, blogId: number) {
        const post = await this.findById(postId, blogId);
        if (!post) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'post not found',
            });
        }
        return post;
    }

    async save(post: Post) {
        return this.postsRepository.save(post);
    }
    async delete(postId: number) {
        return this.postsRepository.delete(postId);
    }
}
