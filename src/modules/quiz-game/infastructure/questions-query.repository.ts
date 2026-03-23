import { Injectable } from '@nestjs/common';
import { GetQuestionsQueryParams } from '../api/input-dto/get-questions-query.params.input-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';
import {
    PaginatedQuestionsViewDto,
    QuestionViewDto,
} from '../api/view-dto/question.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';

@Injectable()
export class QuestionsQueryRepository {
    constructor(
        @InjectRepository(Question)
        private questionsRepository: Repository<Question>,
    ) {}

    async getQuestions(
        query: GetQuestionsQueryParams,
    ): Promise<PaginatedQuestionsViewDto> {
        const sortDirection =
            query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC';
        const queryBuilder = this.questionsRepository
            .createQueryBuilder('q')
            .select([
                'q.id as id',
                'q.body as body',
                'q.correctAnswers as "correctAnswers"',
                'q.published as published',
                'q.createdAt as "createdAt"',
                'q.updatedAt as "updatedAt"',
            ])
            .limit(query.pageSize)
            .offset(query.calculateSkip())
            .orderBy(`q.${query.sortBy}`, sortDirection);

        if (query.bodySearchTerm) {
            queryBuilder.orWhere('q.body ILIKE :body', {
                body: `%${query.bodySearchTerm}%`,
            });
        }
        const questions = await queryBuilder.getRawMany();
        const total = await queryBuilder.getCount();
        return PaginatedViewDto.mapToView({
            items: questions.map(QuestionViewDto.mapToView),
            totalCount: total,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
