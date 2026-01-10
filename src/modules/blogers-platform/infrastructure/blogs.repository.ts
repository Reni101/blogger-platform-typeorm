import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { CreateBlogDto } from '../domain/dto/create-blog.dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class BlogsRepository {
    constructor(
        @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
    ) {}
    async createBlog(dto: CreateBlogDto) {
        const blog = this.blogsRepository.create({
            name: dto.name,
            websiteUrl: dto.websiteUrl,
            isMembership: false,
            description: dto.description,
        });
        await this.blogsRepository.save(blog);

        return blog;
    }

    async findById(id: number) {
        return this.blogsRepository.findOne({ where: { id } });
    }

    async findByIdOrThrow(id: number) {
        const blog = await this.findById(id);
        if (!blog) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'blog not found',
            });
        }
        return blog;
    }

    async save(blog: Blog) {
        return this.blogsRepository.save(blog);
    }
    async delete(blogId: number) {
        return this.blogsRepository.delete(blogId);
    }
}
