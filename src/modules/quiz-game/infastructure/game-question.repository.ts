import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameQuestion } from '../domain/game-question.entity';

@Injectable()
export class GameQuestionRepository {
    constructor(
        @InjectRepository(GameQuestion)
        private gameQuestionRepository: Repository<GameQuestion>,
    ) {}

    async addQuestionsToGame(questions: { id: number }[], gameId: number) {
        await this.gameQuestionRepository.insert(
            questions.map((q, i) => ({
                questionId: q.id,
                index: i,
                gameId,
            })),
        );
    }
}
