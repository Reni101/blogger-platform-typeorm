import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infastructure/questions.repository';

export class DeleteQuestionCommand {
    constructor(public id: number) {}
}

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionUseCase implements ICommandHandler<DeleteQuestionCommand> {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({ id }: DeleteQuestionCommand) {
        const question = await this.questionsRepository.findByIdOrThrow(id);
        await this.questionsRepository.delete(question.id);
    }
}
