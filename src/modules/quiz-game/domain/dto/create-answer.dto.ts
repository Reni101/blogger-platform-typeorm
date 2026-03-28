import { AnswerStatus } from '../answer.entity';

export class CreateAnswerDto {
    answer: string;
    gameId: number;
    status: AnswerStatus;
    playerId: number;
    questionId: number;
}
