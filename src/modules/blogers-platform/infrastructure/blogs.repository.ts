import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { CreateBlogDto } from '../domain/dto/create-blog.dto';

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
}
