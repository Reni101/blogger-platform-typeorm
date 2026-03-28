import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnswersRepository } from '../../infastructure/answers.repository';
import { GameRepository } from '../../infastructure/game.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

export class AnswerCommand {
    constructor(public dto: { userId: number; answer: string }) {}
}

@CommandHandler(AnswerCommand)
export class AnswerUseCase implements ICommandHandler<AnswerCommand> {
    constructor(
        private answersRepository: AnswersRepository,
        private gameRepository: GameRepository,
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
    }
}
