import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';
import { Question } from '../../domain/question.entity';

export class QuestionViewDto {
    id: string;
    body: string;

    correctAnswers: string[];
    published: boolean;
    createdAt: string;
    updatedAt: string | null;

    static mapToView(q: Question): QuestionViewDto {
        const dto = new QuestionViewDto();
        dto.id = q.id.toString();
        dto.body = q.body;
        dto.correctAnswers = q.correctAnswers;
        dto.published = q.published;
        dto.createdAt = q.createdAt.toISOString();
        dto.updatedAt = q.updatedAt ? q.updatedAt.toISOString() : null;
        return dto;
    }
}

export class PaginatedQuestionsViewDto extends PaginatedViewDto<
    QuestionViewDto[]
> {
    @ApiProperty({ type: [QuestionViewDto] })
    items: QuestionViewDto[];
}
