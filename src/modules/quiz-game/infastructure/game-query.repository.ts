import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Game, GameStatus } from '../domain/game.entity';
import { GameViewDto } from '../api/view-dto/game.view-dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class GameQueryRepository {
    constructor(
        @InjectRepository(Game) private gamesRepository: Repository<Game>,
        @InjectDataSource() private dataSource: DataSource,
    ) {}

    async getCurrentGameOrThrow(userId: number) {
        const answersSubquery = (playerAlias: string) =>
            `COALESCE(
                (SELECT jsonb_agg(jsonb_build_object(
                    'questionId', a."questionId"::text,
                    'answerStatus', a.status,
                    'addedAt', a."addedAt"
                ) ORDER BY a."addedAt")
                FROM answers a
                WHERE a."playerId" = ${playerAlias}.id
            ), '[]'::jsonb)`;

        const questionsSubquery = `COALESCE(
            (SELECT jsonb_agg(jsonb_build_object(
                'id', q.id::text,
                'body', q.body
            ) ORDER BY gq.index ASC)
            FROM game_question gq
            JOIN questions q ON gq."questionId" = q.id
            WHERE gq."gameId" = g.id
        ), '[]'::jsonb)`;

        const queryBuilder = this.gamesRepository
            .createQueryBuilder('g')
            .select([
                'g.id as id',
                'g.status as status',
                'g.pairCreatedDate as "pairCreatedDate"',
                'g.startGameDate as "startGameDate"',
                'g.finishGameDate as "finishGameDate"',
                `jsonb_build_object(
                    'answers', ${answersSubquery('p1')},
                    'player', jsonb_build_object('id', u1.id::TEXT, 'login', u1.login),
                    'score', p1.score
                ) as "firstPlayerProgress"`,
                `CASE WHEN p2.id IS NOT NULL THEN jsonb_build_object(
                    'answers', ${answersSubquery('p2')},
                    'player', jsonb_build_object('id', u2.id::TEXT, 'login', u2.login),
                    'score', p2.score
                ) ELSE NULL END as "secondPlayerProgress"`,
                `${questionsSubquery} as questions`,
            ])
            .leftJoin('players', 'p1', 'g."playerOneId" = p1.id')
            .leftJoin('users', 'u1', 'p1."userId" = u1.id')
            .leftJoin('players', 'p2', 'g."playerTwoId" = p2.id')
            .leftJoin('users', 'u2', 'p2."userId" = u2.id')
            .where('g.status != :status', { status: GameStatus.Finished })
            .andWhere('(p1."userId" = :userId OR p2."userId" = :userId)', {
                userId,
            });

        const game = await queryBuilder.getRawOne<GameViewDto>();

        if (!game) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'no active pair for current user',
            });
        }
        return game;
    }

    async findGameByIdOrThrow(id: string) {
        const answersSubquery = (playerAlias: string) =>
            `COALESCE(
                (SELECT jsonb_agg(jsonb_build_object(
                    'questionId', a."questionId"::text,
                    'answerStatus', a.status,
                    'addedAt', a."addedAt"
                ) ORDER BY a."addedAt")
                FROM answers a
                WHERE a."playerId" = ${playerAlias}.id
            ), '[]'::jsonb)`;

        const questionsSubquery = `COALESCE(
            (SELECT jsonb_agg(jsonb_build_object(
                'id', q.id::text,
                'body', q.body
            ) ORDER BY gq.index ASC)
            FROM game_question gq
            JOIN questions q ON gq."questionId" = q.id
            WHERE gq."gameId" = g.id
        ), '[]'::jsonb)`;

        const queryBuilder = this.gamesRepository
            .createQueryBuilder('g')
            .select([
                'g.id as id',
                'g.status as status',
                'g.pairCreatedDate as "pairCreatedDate"',
                'g.startGameDate as "startGameDate"',
                'g.finishGameDate as "finishGameDate"',
                `jsonb_build_object(
                    'answers', ${answersSubquery('p1')},
                    'player', jsonb_build_object('id', u1.id::TEXT, 'login', u1.login),
                    'score', p1.score
                ) as "firstPlayerProgress"`,
                `CASE WHEN p2.id IS NOT NULL THEN jsonb_build_object(
                    'answers', ${answersSubquery('p2')},
                    'player', jsonb_build_object('id', u2.id::TEXT, 'login', u2.login),
                    'score', p2.score
                ) ELSE NULL END as "secondPlayerProgress"`,
                `${questionsSubquery} as questions`,
            ])
            .leftJoin('players', 'p1', 'g."playerOneId" = p1.id')
            .leftJoin('users', 'u1', 'p1."userId" = u1.id')
            .leftJoin('players', 'p2', 'g."playerTwoId" = p2.id')
            .leftJoin('users', 'u2', 'p2."userId" = u2.id')
            .where('g.status != :status', { status: GameStatus.Finished })
            .andWhere('g.id =:id', { id });

        const game = await queryBuilder.getRawOne<GameViewDto>();

        if (!game) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'game not found',
            });
        }
        return game;
    }
}
