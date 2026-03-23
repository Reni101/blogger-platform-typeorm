import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateQuestionInputDto } from '../../api/input-dto/question.input-dto';
import { QuestionsRepository } from '../../infastructure/questions.repository';
import { QuestionViewDto } from '../../api/view-dto/question.view-dto';

export class CreateQuestionCommand {
    constructor(public dto: CreateQuestionInputDto) {}
}

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionUseCase implements ICommandHandler<CreateQuestionCommand> {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({ dto }: CreateQuestionCommand) {
        const question = await this.questionsRepository.createQuestion(dto);
        return QuestionViewDto.mapToView(question);
    }
}
