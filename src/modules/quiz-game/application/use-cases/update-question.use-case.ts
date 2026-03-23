import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateQuestionInputDto } from '../../api/input-dto/question.input-dto';
import { QuestionsRepository } from '../../infastructure/questions.repository';

export class UpdateQuestionCommand {
    constructor(public dto: CreateQuestionInputDto & { id: number }) {}
}

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionUseCase implements ICommandHandler<UpdateQuestionCommand> {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({ dto }: UpdateQuestionCommand) {
        const question = await this.questionsRepository.findByIdOrThrow(dto.id);
        question.body = dto.body;
        question.correctAnswers = dto.correctAnswers;
        await this.questionsRepository.save(question);
    }
}
