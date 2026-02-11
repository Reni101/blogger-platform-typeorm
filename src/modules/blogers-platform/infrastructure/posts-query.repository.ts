import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { PostReaction } from '../domain/post-reaction.entity';
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
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async getByIdOrThrow(dto: { postId: number; userId?: number }) {
        const postReactionCTE = this.dataSource
            .createQueryBuilder()
            .select([
                'pr."postId"',
                'COUNT(*) FILTER (WHERE pr.status = \'Like\')   AS "likesCount"',
                'COUNT(*) FILTER (WHERE pr.status = \'Dislike\') AS "dislikesCount"',
            ])
            .from('post_reaction', 'pr')
            .where('pr."postId" = :postId', { postId: dto.postId })
            .groupBy('pr."postId"');

        const newestLikesCTE = this.dataSource
            .createQueryBuilder()
            .select([
                'pr."postId"',
                `jsonb_agg(
                           jsonb_build_object(
                           'addedAt', pr."createdAt",
                           'login', u.login,
                           'userId', u.id::TEXT
                             ) ORDER BY pr."createdAt" DESC
                           ) AS "newestLikes"`,
            ])
            .from(
                (subQ) =>
                    subQ
                        .select([
                            'pr."postId" as "postId"',
                            'pr."createdAt" as "createdAt"',
                            'pr."userId" as "userId"',
                        ])
                        .from(PostReaction, 'pr')
                        .where(
                            'pr.status = \'Like\' AND pr."postId" = :postId',
                            { postId: dto.postId },
                        )
                        .orderBy('pr."createdAt"', 'DESC')
                        .limit(3),
                'pr',
            )
            .leftJoin('users', 'u', 'u.id = pr."userId"')
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
                'p.id::TEXT as id',
                'p.title as title',
                'p."shortDescription" as "shortDescription"',
                'p.content as content',
                'p."blogId"::TEXT as "blogId"',
                'b.name as "blogName"',
                'p."createdAt" as "createdAt"',
                `jsonb_build_object(
                     'likesCount',    COALESCE(pr."likesCount", 0)::int,
                     'dislikesCount', COALESCE(pr."dislikesCount", 0)::int,
                     'myStatus',      COALESCE(ur.status, 'None'),
                     'newestLikes',   COALESCE(nl."newestLikes", '[]'::jsonb)
                                 ) AS "extendedLikesInfo"`,
            ])
            .leftJoin('p.blog', 'b')
            .addCommonTableExpression(postReactionCTE, 'pr')
            .addCommonTableExpression(newestLikesCTE, 'nl')
            .addCommonTableExpression(userReactionCTE, 'ur')
            .leftJoin('pr', 'pr', 'pr."postId" = p.id')
            .leftJoin('nl', 'nl', 'nl."postId" = p.id')
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

        const postsReactionCTE = this.dataSource
            .createQueryBuilder()
            .select([
                'pr."postId"',
                'COUNT(*) FILTER (WHERE pr.status = \'Like\')   AS "likesCount"',
                'COUNT(*) FILTER (WHERE pr.status = \'Dislike\') AS "dislikesCount"',
            ])
            .from('post_reaction', 'pr')
            .groupBy('pr."postId"');

        const newestLikesCTE = this.dataSource
            .createQueryBuilder()
            .select([
                'pr."postId"',
                `jsonb_agg(
                    jsonb_build_object(
                        'addedAt', pr."createdAt",
                        'login', u.login,
                        'userId', u.id::TEXT
                         ) ORDER BY pr."createdAt" DESC
                      ) AS "newestLikes"`,
            ])
            .from(
                (subQ) =>
                    subQ
                        .select([
                            'pr."postId" as "postId"',
                            'pr."createdAt" as "createdAt"',
                            'pr."userId" as "userId"',
                            'row_number() OVER (PARTITION BY pr."postId" ORDER BY pr."createdAt" DESC) as "rn"',
                        ])
                        .from(PostReaction, 'pr')
                        .where("pr.status = 'Like'"),
                'pr',
            )
            .leftJoin('users', 'u', 'u.id = pr."userId"')
            .where('pr.rn <= 3')
            .groupBy('pr."postId"');
        const userReactionsCTE = this.dataSource
            .createQueryBuilder()
            .select(['"postId"', 'status'])
            .from('post_reaction', 'post_reaction')
            .where('"userId" = :userId', { userId: dto.userId ?? null });

        const postsQB = this.postsRepository
            .createQueryBuilder('p')
            .select([
                'p.id ::TEXT as id',
                'p.title as title',
                'p."shortDescription" as "shortDescription"',
                'p.content as "content"',
                'p."blogId"::TEXT as "blogId"',
                'b.name AS "blogName"',
                'p."createdAt" as "createdAt"',
                `jsonb_build_object(
                'likesCount',    COALESCE(pr."likesCount", 0),
                'dislikesCount', COALESCE(pr."dislikesCount", 0),
                'myStatus',      COALESCE(ur.status, 'None'),
                'newestLikes',   COALESCE(nl."newestLikes", '[]'::jsonb)
              ) AS "extendedLikesInfo"`,
            ])
            .addCommonTableExpression(postsReactionCTE, 'pr')
            .addCommonTableExpression(newestLikesCTE, 'nl')
            .addCommonTableExpression(userReactionsCTE, 'ur')
            .leftJoin('p.blog', 'b')
            .leftJoin('pr', 'pr', 'p.id = pr."postId"')
            .leftJoin('nl', 'nl', 'p.id = nl."postId"')
            .leftJoin('ur', 'ur', 'p.id = ur."postId"')
            .orderBy(sortField, sortDirection)
            .limit(query.pageSize)
            .offset(query.calculateSkip());

        if (dto.blogId) {
            postsQB.andWhere('p.blogId = :id', { id: dto.blogId });
        }

        const posts = await postsQB.getRawMany<PostViewDto>();
        const total = await postsQB.getCount();

        return PaginatedViewDto.mapToView({
            items: posts,
            totalCount: total,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
