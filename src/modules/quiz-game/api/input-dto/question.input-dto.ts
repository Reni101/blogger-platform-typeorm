import { Trim } from '../../../../core/decorators/transform/trim';
import { IsArray, IsString, Length } from 'class-validator';
import { questionBodyConstraints } from '../../domain/question.entity';

export class CreateQuestionInputDto {
    @Trim()
    @IsString()
    @Length(
        questionBodyConstraints.minLength,
        questionBodyConstraints.maxLength,
    )
    body: string;

    @IsArray()
    @IsString({ each: true })
    correctAnswers: string[];
}
