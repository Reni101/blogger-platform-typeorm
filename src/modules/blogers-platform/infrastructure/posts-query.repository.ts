import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { GetPostsQueryParams } from '../api/input-dto/post/get-posts-query-params.input-dto';
import { IRawPost, PostViewDto } from '../api/view-dto/posts.view-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';
import { PostSortBy } from '../api/input-dto/post/posts-sort-by';

@Injectable()
export class PostsQueryRepository {
    constructor(
        @InjectRepository(Post) private postsRepository: Repository<Post>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async getByIdOrThrow(dto: { postId: number; userId?: number }) {
        const postReactionCTE = this.dataSource
            .createQueryBuilder()
            .select([
                'pr."postId"',
                'COUNT(*) FILTER (WHERE pr.status = \'Like\')   AS "likesCount"',
                'COUNT(*) FILTER (WHERE pr.status = \'Dislike\') AS "dislikesCount"',
                ` (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'addedAt', sub."createdAt",
                    'login', u.login,
                    'userId', u.id
                ) ORDER BY sub."createdAt" DESC
            )
            FROM (
                SELECT pr2."createdAt", pr2."userId"
                FROM "post_reaction" pr2
                WHERE pr2."postId" = $1
                  AND pr2.status = 'Like'
                ORDER BY pr2."createdAt" DESC
                LIMIT 3
            ) sub
            LEFT JOIN "users" u ON u.id = sub."userId"
                ) AS newest_likes`,
            ])
            .from('post_reaction', 'pr')
            .where('pr."postId" = :postId', { postId: dto.postId })
            .groupBy('pr."postId"');

        const userReactionCTE = this.dataSource
            .createQueryBuilder()
            .select(['"postId"', 'status'])
            .from('post_reaction', 'pr')
            .where('pr."userId" = :userId AND pr."postId" =:postId', {
                userId: dto.userId ?? null,
                postId: dto.postId,
            });

        const postQb = this.postsRepository
            .createQueryBuilder('p')
            .select([
                'p.id as id',
                'p.title as title',
                'p."shortDescription" as "shortDescription"',
                'p.content as content',
                'p."blogId" as "blogId"',
                'b.name as "blogName"',
                'p."createdAt" as "createdAt"',
                `jsonb_build_object(
                     'likesCount',    COALESCE(pr."likesCount", 0)::int,
                     'dislikesCount', COALESCE(pr."dislikesCount", 0)::int,
                     'myStatus',      COALESCE(ur.status, 'None'),
                     'newestLikes',   COALESCE(pr.newest_likes, '[]'::jsonb)
                                 ) AS "extendedLikesInfo"`,
            ])
            .leftJoin('p.blog', 'b')
            .addCommonTableExpression(postReactionCTE, 'pr')
            .addCommonTableExpression(userReactionCTE, 'ur')
            .leftJoin('pr', 'pr', 'pr."postId" = p.id')
            .leftJoin('ur', 'ur', 'ur."postId" = p.id')
            .where('p.id = :id', { id: dto.postId });

        const post = await postQb.getRawOne<PostViewDto>();

        if (!post) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'post not found',
            });
        }
        return post;
    }

    async getPosts(
        query: GetPostsQueryParams,
        dto: { blogId?: number; userId?: number },
    ) {
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
        if (dto.blogId) {
            queryBuilder.andWhere('p.blogId = :id', { id: dto.blogId });
        }

        const posts = await queryBuilder.getRawMany<IRawPost>();

        const total = await queryBuilder.getCount();

        return PaginatedViewDto.mapToView({
            items: posts.map(PostViewDto.mapToView),
            totalCount: total,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
