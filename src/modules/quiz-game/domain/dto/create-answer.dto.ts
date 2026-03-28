import { AnswerStatus } from '../answer.entity';

export class CreateAnswerDto {
    answer: string;
    gameId: string;
    status: AnswerStatus;
    playerId: number;
    questionId: number;
}
