import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Game, GameStatus } from '../domain/game.entity';
import { GameViewDto } from '../api/view-dto/game.view-dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class GameQueryRepository {
    constructor(
        @InjectRepository(Game) private gamesRepository: Repository<Game>,
    ) {}

    async getCurrentGameOrThrow(userId: number) {
        const game = await this.gamesRepository.findOne({
            where: [
                { playerOne: { userId }, status: Not(GameStatus.Finished) },
                { playerTwo: { userId }, status: Not(GameStatus.Finished) },
            ],
            relations: {
                gameQuestions: { question: true },
                playerOne: { answers: true, user: true },
                playerTwo: { answers: true, user: true },
            },
        });

        if (!game) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'no active pair for current user',
            });
        }
        return GameViewDto.mapToView(game);
    }
    async findGameByIdOrThrow(id: number) {
        const game = await this.gamesRepository.findOne({
            where: { id },
            relations: {
                gameQuestions: { question: true },
                playerOne: { answers: true, user: true },
                playerTwo: { answers: true, user: true },
            },
        });

        if (!game) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'game not found',
            });
        }
        return GameViewDto.mapToView(game);
    }
}
