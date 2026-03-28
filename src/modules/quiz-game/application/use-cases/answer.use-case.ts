import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnswersRepository } from '../../infastructure/answers.repository';
import { GameRepository } from '../../infastructure/game.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { AnswerStatus } from '../../domain/answer.entity';
import { PlayerRepository } from '../../infastructure/player.repository';

export class AnswerCommand {
    constructor(public dto: { userId: number; answer: string }) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase implements ICommandHandler<AnswerCommand> {
    constructor(
        private answersRepository: AnswersRepository,
        private gameRepository: GameRepository,
        private playerRepository: PlayerRepository,
    ) {}

    async execute({ dto }: AnswerCommand) {
        const game = await this.gameRepository.findActiveGame(dto.userId);

        if (!game) {
            throw new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'user is not inside active game',
            });
        }

        const userAnswers = await this.answersRepository.getUserAnswers(
            dto.userId,
            game.id,
        );

        if (userAnswers.length === 5) {
            throw new DomainException({
                code: DomainExceptionCode.Forbidden,
                message: 'user already answered to all questions',
            });
        }

        const sortedQuestions = game.gameQuestions.sort(
            (a, b) => a.index - b.index,
        );

        const currentQuestion = sortedQuestions[userAnswers.length].question;

        const userAnswer = dto.answer.toLowerCase();
        const isCorrect = currentQuestion.correctAnswers.some(
            (a) => a.toLowerCase() === userAnswer,
        );
        const status = isCorrect
            ? AnswerStatus.Correct
            : AnswerStatus.Incorrect;

        const player =
            game.playerOne?.userId === +dto.userId
                ? game.playerOne
                : game.playerTwo!;
        if (status === AnswerStatus.Correct) {
            player.score = player.score + 1;
            await this.playerRepository.save(player);
        }
        const answer = await this.answersRepository.createAnswer({
            answer: dto.answer,
            status,
            questionId: currentQuestion.id,
            gameId: game.id,
            playerId: player.id,
        });
        const totalUserAnswers = userAnswers.length + 1;

        if (totalUserAnswers === 5) {
            const opponent =
                game.playerOne?.userId === dto.userId
                    ? game.playerTwo!
                    : game.playerOne!;

            const opponentAnswers = await this.answersRepository.getUserAnswers(
                opponent.userId,
                game.id,
            );

            if (opponentAnswers.length === 5) {
                await this.gameRepository.finishGame(game.id);

                const hasCorrectAnswer = opponentAnswers.some(
                    (a) => a.status === AnswerStatus.Correct,
                );

                if (hasCorrectAnswer) {
                    opponent.score += 1;
                    await this.playerRepository.save(opponent);
                }
            }
        }
        return answer.id;
    }
}
