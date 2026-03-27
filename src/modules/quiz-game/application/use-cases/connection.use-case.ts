import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GameRepository } from '../../infastructure/game.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { PlayerRepository } from '../../infastructure/player.repository';
import { QuestionsRepository } from '../../infastructure/questions.repository';
import { GameQuestionRepository } from '../../infastructure/game-question.repository';
import { GameStatus } from '../../domain/game.entity';

export class ConnectionCommand {
    constructor(public userId: number) {}
}

@CommandHandler(ConnectionCommand)
export class ConnectionUseCase implements ICommandHandler<ConnectionCommand> {
    constructor(
        private gameRepository: GameRepository,
        private playerRepository: PlayerRepository,
        private questionsRepository: QuestionsRepository,
        private gameQuestionRepository: GameQuestionRepository,
    ) {}

    async execute({ userId }: ConnectionCommand) {
        const activeGame =
            await this.gameRepository.findActiveOrPendingGameByUserId(userId);

        if (activeGame) {
            throw new DomainException({
                message: 'Current user is already participating in active pair',
                code: DomainExceptionCode.Forbidden,
            });
        }

        const game = await this.gameRepository.findPendingGame();
        if (!game) {
            const player1 = await this.playerRepository.createPlayer(userId);
            const game = await this.gameRepository.createGame(player1.id);
            return game.id;
        } else {
            const player2 = await this.playerRepository.createPlayer(userId);
            const qs = await this.questionsRepository.getRandomQuestions();
            await this.gameQuestionRepository.addQuestionsToGame(qs, game.id);
            game.playerTwoId = player2.id;
            game.status = GameStatus.Active;
            game.startGameDate = new Date();
            await this.gameRepository.save(game);
            return game.id;
        }
    }
}
