import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game, GameStatus } from '../domain/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameRepository {
    constructor(
        @InjectRepository(Game) private gamesRepository: Repository<Game>,
    ) {}

    async findPendingGame() {
        return this.gamesRepository.findOne({
            where: { status: GameStatus.Pending },
        });
    }
    async findActiveOrPendingGameByUserId(userId: number) {
        return this.gamesRepository.findOne({
            where: [
                { status: GameStatus.Active, playerOne: { userId } },
                { status: GameStatus.Active, playerTwo: { userId } },
                { status: GameStatus.Pending, playerOne: { userId } },
                { status: GameStatus.Pending, playerTwo: { userId } },
            ],
        });
    }

    async findActiveGame(userId: number) {
        return this.gamesRepository.findOne({
            where: [
                { status: GameStatus.Active, playerOne: { userId } },
                { status: GameStatus.Active, playerTwo: { userId } },
            ],

            relations: {
                gameQuestions: { question: true },
                playerOne: { answers: true },
                playerTwo: { answers: true },
            },
        });
    }

    async createGame(playerId: number) {
        const game = this.gamesRepository.create({
            status: GameStatus.Pending,
            playerOneId: playerId,
        });
        await this.gamesRepository.save(game);
        return game;
    }

    async save(game: Game) {
        await this.gamesRepository.save(game);
    }

    async findActiveGamesWithRelations() {
        return this.gamesRepository.find({
            where: { status: GameStatus.Active },
            relations: {
                playerOne: true,
                playerTwo: true,
                answers: true,
                gameQuestions: { question: true },
            },
        });
    }

    async finishGame(gameId: number) {
        await this.gamesRepository.update(gameId, {
            status: GameStatus.Finished,
            finishGameDate: new Date(),
        });
    }
}
