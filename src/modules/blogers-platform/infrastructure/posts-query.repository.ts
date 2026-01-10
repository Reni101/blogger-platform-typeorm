import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { GetPostsQueryParams } from '../api/input-dto/post/get-posts-query-params.input-dto';
import { PostViewDto } from '../api/view-dto/posts.view-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostSortBy } from '../api/input-dto/post/posts-sort-by';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
    ) {}

    async getByIdOrThrow(id: number) {
        const post = await this.postsRepository.findOne({
            select: {
                blog: { name: true },
                id: true,
                shortDescription: true,
                blogId: true,
                title: true,
                content: true,
                createdAt: true,
            },
            relations: { blog: true },
            where: { id },
        });

        if (!post) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'post not found',
            });
        }
        return post;
    }

    async getPosts(query: GetPostsQueryParams, blogId?: number) {
        const sortField =
            query.sortBy === PostSortBy.BlogName
                ? 'b.name'
                : `p.${query.sortBy}`;

        const sortDirection =
            query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

        const queryBuilder = this.postsRepository
            .createQueryBuilder('p')
            .select([
                'p.id',
                'p.shortDescription',
                'p.blogId',
                'p.title',
                'p.content',
                'p.createdAt',
                'b.name',
            ])
            .leftJoin('p.blog', 'b')
            .limit(query.pageSize)
            .offset(query.calculateSkip())
            .orderBy(sortField, sortDirection);
        if (blogId) {
            queryBuilder.andWhere('p.blogId = :id', { id: blogId });
        }
        const posts = await queryBuilder.getRawMany();

        const total = await queryBuilder.getCount();

        return PaginatedViewDto.mapToView({
            items: posts.map(PostViewDto.mapToView),
            totalCount: total,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
