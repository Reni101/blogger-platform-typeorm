import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import { CreateQuestionInputDto } from '../api/input-dto/question.input-dto';

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
}
