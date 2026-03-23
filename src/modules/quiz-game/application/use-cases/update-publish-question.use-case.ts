import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../../infastructure/questions.repository';

export class UpdatePublishQuestionCommand {
    constructor(public dto: { id: number; published: boolean }) {}
}

@CommandHandler(UpdatePublishQuestionCommand)
export class UpdatePublishQuestionUseCase implements ICommandHandler<UpdatePublishQuestionCommand> {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({ dto }: UpdatePublishQuestionCommand) {
        const question = await this.questionsRepository.findByIdOrThrow(dto.id);
        question.published = dto.published;
        await this.questionsRepository.save(question);
    }
}
