import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaQuizController } from './api/sa.quiz.controller';
import { Question } from './domain/question.entity';
import { QuestionsQueryRepository } from './infastructure/questions-query.repository';
import { CreateQuestionUseCase } from './application/use-cases/create-question.use-case';
import { QuestionsRepository } from './infastructure/questions.repository';
import { DeleteQuestionUseCase } from './application/use-cases/delete-question.use-case';
import { UpdateQuestionUseCase } from './application/use-cases/update-question.use-case';
import { UpdatePublishQuestionUseCase } from './application/use-cases/update-publish-question.use-case';
import { QuizGameController } from './api/quiz-game.controller';
import { GameQueryRepository } from './infastructure/game-query.repository';
import { Answer } from './domain/answer.entity';
import { Game } from './domain/game.entity';
import { Player } from './domain/player.entity';
import { GameQuestion } from './domain/game-question.entity';
import { ConnectionUseCase } from './application/use-cases/connection.use-case';
import { GameRepository } from './infastructure/game.repository';
import { PlayerRepository } from './infastructure/player.repository';
import { GameQuestionRepository } from './infastructure/game-question.repository';
import { AnswersRepository } from './infastructure/answers.repository';
import { AnswerUseCase } from './application/use-cases/answer.use-case';
import { AnswerQueryRepository } from './infastructure/answer-query.repository';
import { PlayerQueryRepository } from './infastructure/player-query.repository';

const useCases = [
    CreateQuestionUseCase,
    DeleteQuestionUseCase,
    UpdateQuestionUseCase,
    UpdatePublishQuestionUseCase,
    ConnectionUseCase,
    AnswerUseCase,
];

const entities = [Question, Answer, Game, Player, Question, GameQuestion];

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [SaQuizController, QuizGameController],
    providers: [
        QuestionsQueryRepository,
        QuestionsRepository,
        GameQueryRepository,
        GameRepository,
        PlayerRepository,
        GameQuestionRepository,
        AnswersRepository,
        AnswerQueryRepository,
        PlayerQueryRepository,
        ...useCases,
    ],
})
export class QuizGameModule {}
