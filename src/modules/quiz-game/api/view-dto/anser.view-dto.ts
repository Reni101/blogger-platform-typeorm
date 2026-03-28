import { Answer, AnswerStatus } from '../../domain/answer.entity';

export class AnswerViewDto {
    'questionId': string;
    'answerStatus': AnswerStatus;
    'addedAt': string;

    static mapToView(a: Answer): AnswerViewDto {
        const dto = new AnswerViewDto();
        dto.questionId = a.questionId.toString();
        dto.answerStatus = a.status;
        dto.addedAt = a.addedAt.toISOString();
        return dto;
    }
}
