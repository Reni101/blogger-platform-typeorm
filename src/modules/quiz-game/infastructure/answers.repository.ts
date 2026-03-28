import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from '../domain/answer.entity';

@Injectable()
export class AnswersRepository {
    constructor(
        @InjectRepository(Answer) private answersRepository: Repository<Answer>,
    ) {}

    async getUserAnswers(userId: number, gameId: string) {
        return this.answersRepository.findBy({ player: { userId }, gameId });
    }
}
