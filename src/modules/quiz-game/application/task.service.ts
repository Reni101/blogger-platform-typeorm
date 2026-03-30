import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GameRepository } from '../infastructure/game.repository';
import { PlayerRepository } from '../infastructure/player.repository';
import { Answer, AnswerStatus } from '../domain/answer.entity';
import { Player, PlayerStatus } from '../domain/player.entity';

@Injectable()
export class TaskService {
    constructor(
        private gameRepository: GameRepository,
        private playerRepository: PlayerRepository,
    ) {}

    @Cron('*/10 * * * * *')
    async autoFinishGame() {
        const games = await this.gameRepository.findActiveGamesWithRelations();

        for (const game of games) {
            const p1Answers = game.answers.filter(
                (a) => a.playerId === game.playerOneId,
            );
            const p2Answers = game.answers.filter(
                (a) => a.playerId === game.playerTwoId,
            );

            let finisher: Player | null = null;
            let finisherAnswers: Answer[] = [];
            let opponent: Player | null = null;

            if (p1Answers.length === 5 && p2Answers.length < 5) {
                finisher = game.playerOne;
                finisherAnswers = p1Answers;
                opponent = game.playerTwo;
            } else if (p2Answers.length === 5 && p1Answers.length < 5) {
                finisher = game.playerTwo;
                finisherAnswers = p2Answers;
                opponent = game.playerOne;
            }

            if (!finisher || !finisherAnswers.length || !opponent) continue;

            const lastAnswerTime = Math.max(
                ...finisherAnswers.map((a) => a.addedAt.getTime()),
            );

            if (Date.now() - lastAnswerTime < 10_000) continue;

            const hasCorrectAnswer = finisherAnswers.some(
                (a) => a.status === AnswerStatus.Correct,
            );
            if (hasCorrectAnswer) {
                finisher.score += 1;
            }

            if (finisher.score > opponent.score) {
                finisher.status = PlayerStatus.Win;
                opponent.status = PlayerStatus.Lose;
            } else if (finisher.score < opponent.score) {
                finisher.status = PlayerStatus.Lose;
                opponent.status = PlayerStatus.Win;
            } else {
                finisher.status = PlayerStatus.Draw;
                opponent.status = PlayerStatus.Draw;
            }

            await this.playerRepository.save(finisher);
            await this.playerRepository.save(opponent);
            await this.gameRepository.finishGame(game.id);
        }
    }
}
