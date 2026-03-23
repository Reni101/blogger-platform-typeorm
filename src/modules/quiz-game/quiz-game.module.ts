import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaQuizController } from './api/sa.quiz.controller';
import { Question } from './domain/question.entity';
import { QuestionsQueryRepository } from './infastructure/questions-query.repository';
import { CreateQuestionUseCase } from './application/use-cases/create-question.use-case';
import { QuestionsRepository } from './infastructure/questions.repository';
import { DeleteQuestionUseCase } from './application/use-cases/delete-question.use-case';

const useCases = [CreateQuestionUseCase, DeleteQuestionUseCase];

@Module({
    imports: [TypeOrmModule.forFeature([Question])],
    controllers: [SaQuizController],
    providers: [QuestionsQueryRepository, QuestionsRepository, ...useCases],
})
export class QuizGameModule {}
