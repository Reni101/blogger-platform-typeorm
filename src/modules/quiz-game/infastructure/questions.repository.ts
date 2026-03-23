import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import { CreateQuestionInputDto } from '../api/input-dto/question.input-dto';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

@Injectable()
export class QuestionsRepository {
    constructor(
        @InjectRepository(Question)
        private questionsRepository: Repository<Question>,
    ) {}

    async createQuestion(dto: CreateQuestionInputDto) {
        const question = this.questionsRepository.create({
            body: dto.body,
            correctAnswers: dto.correctAnswers,
        });

        await this.questionsRepository.save(question);
        return question;
    }

    async findById(id: number) {
        return this.questionsRepository.findOne({ where: { id } });
    }

    async findByIdOrThrow(id: number) {
        const question = await this.findById(id);
        if (!question) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'question not found',
            });
        }
        return question;
    }

    async delete(questionId: number) {
        return this.questionsRepository.delete(questionId);
    }
}
