import { GameStatus } from '../../domain/game.entity';
import { AnswerStatus } from '../../domain/answer.entity';

export class PlayerProgress {
    answers: {
        questionId: string;
        answerStatus: AnswerStatus;
        addedAt: Date;
    }[];
    player: { id: string; login: string };
    score: number;
}

export class GameViewDto {
    id: string;
    firstPlayerProgress: PlayerProgress;
    secondPlayerProgress: PlayerProgress | null;
    status: GameStatus;
    questions: { id: string; body: string }[] | null;
    pairCreatedDate: string;
    startGameDate: string | null;
    finishGameDate: string | null;
}
