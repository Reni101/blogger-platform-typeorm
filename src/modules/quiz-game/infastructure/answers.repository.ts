import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../domain/answer.entity';
import { CreateAnswerDto } from '../domain/dto/create-answer.dto';

@Injectable()
export class AnswersRepository {
    constructor(
        @InjectRepository(Answer) private answersRepository: Repository<Answer>,
    ) {}

    async createAnswer(dto: CreateAnswerDto) {
        const answer = this.answersRepository.create({
            answer: dto.answer,
            gameId: dto.gameId,
            status: dto.status,
            playerId: dto.playerId,
            questionId: dto.questionId,
        });
        await this.answersRepository.save(answer);
        return answer;
    }

    async getUserAnswers(userId: number, gameId: number) {
        return this.answersRepository.findBy({ player: { userId }, gameId });
    }

    async save(answer: Answer) {
        await this.answersRepository.save(answer);
    }
}
