import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Comment } from '../domain/comment.entity';
import { CommentViewDto } from '../api/view-dto/comment.view-dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class CommentsQueryRepository {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async findById(id: number, userId?: number) {
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
                'c.id as id',
                'c.content as content',
                'c."createdAt" as createdAt',
                'u.login as "userLogin"',
                'u.id as "userId"',
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
}
