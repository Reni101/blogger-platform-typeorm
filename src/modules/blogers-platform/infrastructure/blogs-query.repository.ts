import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../domain/blog.entity';
import { GetBlogsQueryParams } from '../api/input-dto/blog/get-blogs-query-params.input-dto';
import {
    BlogViewDto,
    PaginatedBlogsViewDto,
} from '../api/view-dto/blogs.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';

@Injectable()
export class BlogsQueryRepository {
    constructor(
        @InjectRepository(Blog) private blogsRepository: Repository<Blog>,
    ) {}

    async getBlogs(query: GetBlogsQueryParams): Promise<PaginatedBlogsViewDto> {
        const queryBuilder = this.blogsRepository
            .createQueryBuilder('b')
            .select([
                'b.id',
                'b.name',
                'b.description',
                'b.websiteUrl',
                'b.createdAt',
                'b.isMembership',
            ])
            .limit(query.pageSize)
            .offset(query.calculateSkip())
            .orderBy(
                `b.${query.sortBy}`,
                query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC',
            );

        if (query.searchNameTerm) {
            queryBuilder.orWhere('b.name ILIKE :name', {
                name: `%${query.searchNameTerm}%`,
            });
        }
        const blogs = await queryBuilder.getRawMany();
        const total = await queryBuilder.getCount();

        return PaginatedViewDto.mapToView({
            items: blogs.map(BlogViewDto.mapToView),
            totalCount: total,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
