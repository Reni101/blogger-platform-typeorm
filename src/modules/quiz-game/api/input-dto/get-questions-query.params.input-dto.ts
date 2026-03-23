import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PublishedStatus, QuestionsSortBy } from './questions-sort-by';

export class GetQuestionsQueryParams extends BaseQueryParams {
    @IsEnum(QuestionsSortBy)
    sortBy = QuestionsSortBy.CreatedAt;

    @IsString()
    @IsOptional()
    bodySearchTerm: string | null = null;

    @IsEnum(PublishedStatus)
    publishedStatus = PublishedStatus.All;
}
