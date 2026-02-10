import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';
import {
    CommentViewDto,
    PaginatedCommentsViewDto,
} from '../api/view-dto/comment.view-dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { GetCommentsQueryParams } from '../api/input-dto/comments/get-comments-query-params.input-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async getByIdOrThrow(id: number, userId?: number) {
        const likesInfo = this.dataSource
            .createQueryBuilder()
            .select([
                'cr."commentId"',
                'COUNT(*) FILTER (WHERE cr.status = \'Like\')    AS "likesCount"',
                'COUNT(*) FILTER (WHERE cr.status = \'Dislike\') AS "dislikesCount"',
                'MAX(cr.status) FILTER (WHERE cr."userId" = :userId) AS "myStatus"',
            ])
            .from('comment_reaction', 'cr')
            .where('cr."commentId" = :id')
            .setParameters({ id, userId: userId ?? null })
            .groupBy('cr."commentId"');

        const commentQb = this.commentsRepository
            .createQueryBuilder('c')
            .select([
                'c.id::TEXT as id',
                'c.content as content',
                'c."createdAt" as "createdAt"',
                `json_build_object('userId', u.id::TEXT, 'userLogin', u.login) AS "commentatorInfo"`,
                `jsonb_build_object(
                        'likesCount', COALESCE(li."likesCount", 0)::int,
                        'dislikesCount', COALESCE(li."dislikesCount", 0)::int,
                        'myStatus', COALESCE(li."myStatus", 'None')
                    ) AS "likesInfo"`,
            ])
            .where('c.id = :id')
            .addCommonTableExpression(likesInfo, 'li')
            .leftJoin('c.user', 'u')
            .leftJoin('li', 'li', 'li."commentId" = c.id')
            .setParameters({ id, userId: userId ?? 0 });

        const comment = await commentQb.getRawOne<CommentViewDto>();
        if (!comment) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'comment not found',
            });
        }
        return comment;
    }

    async getComments(dto: {
        postId: number;
        userId?: number;
        query: GetCommentsQueryParams;
    }): Promise<PaginatedCommentsViewDto> {
        const sortDirection =
            dto.query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';

        const likesInfoCTE = this.dataSource
            .createQueryBuilder()
            .select([
                'cr."commentId"',
                'COUNT(*) FILTER (WHERE cr.status = \'Like\')    AS "likesCount"',
                'COUNT(*) FILTER (WHERE cr.status = \'Dislike\') AS "dislikesCount"',
                'MAX(cr.status) FILTER (WHERE cr."userId" = :userId) AS "myStatus"',
            ])
            .from('comment_reaction', 'cr')
            .setParameters({ userId: dto?.userId ?? null })
            .groupBy('cr."commentId"');

        const commentQb = this.commentsRepository
            .createQueryBuilder('c')
            .select([
                'c.id::TEXT as id',
                'c.content as content',
                'c."createdAt" as "createdAt"',
                `json_build_object('userId', u.id::TEXT, 'userLogin', u.login) AS "commentatorInfo"`,
                `jsonb_build_object(
                        'likesCount', COALESCE(li."likesCount", 0)::int,
                        'dislikesCount', COALESCE(li."dislikesCount", 0)::int,
                        'myStatus', COALESCE(li."myStatus", 'None')
                    ) AS "likesInfo"`,
            ])
            .where('c."postId" = :postId')
            .addCommonTableExpression(likesInfoCTE, 'li')
            .leftJoin('c.user', 'u')
            .leftJoin('li', 'li', 'li."commentId" = c.id')
            .setParameters({ postId: dto.postId, userId: dto?.userId ?? null })
            .limit(dto.query.pageSize)
            .offset(dto.query.calculateSkip())
            .orderBy(`c.${dto.query.sortBy}`, sortDirection);

        const result = await commentQb.getRawMany<CommentViewDto>();
        const total = await commentQb.getCount();
        return PaginatedViewDto.mapToView({
            items: result,
            totalCount: total,
            page: dto.query.pageNumber,
            size: dto.query.pageSize,
        });
    }
}
