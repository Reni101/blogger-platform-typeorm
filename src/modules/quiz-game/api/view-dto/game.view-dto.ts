import { Game, GameStatus } from '../../domain/game.entity';
import { AnswerViewDto } from './anser.view-dto';

export class PlayerProgress {
    answers: AnswerViewDto[] | null;
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

    static mapToView(g: Game): GameViewDto {
        const dto = new GameViewDto();
        dto.id = g.id.toString();
        dto.status = g.status;
        dto.questions = g.gameQuestions.length
            ? g.gameQuestions
                  .sort((a, b) => a.index - b.index)
                  .map((q) => ({
                      id: q.question.id.toString(),
                      body: q.question.body,
                  }))
            : null;
        dto.pairCreatedDate = g.pairCreatedDate.toISOString();
        dto.startGameDate = g.startGameDate?.toISOString() ?? null;
        dto.finishGameDate = g.finishGameDate?.toISOString() ?? null;

        dto.firstPlayerProgress = {
            player: {
                id: g.playerOne?.userId.toString() ?? '',
                login: g.playerOne?.user.login ?? '',
            },
            score: g.playerOne?.score ?? 0,
            answers:
                g.playerOne?.answers
                    .sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime())
                    .map(AnswerViewDto.mapToView) ?? [],
        };

        dto.secondPlayerProgress = g.playerTwo
            ? {
                  player: {
                      id: g.playerTwo?.userId.toString() ?? '',
                      login: g.playerTwo?.user.login ?? '',
                  },
                  score: g.playerTwo?.score ?? 0,
                  answers:
                      g.playerTwo?.answers
                          .sort(
                              (a, b) =>
                                  a.addedAt.getTime() - b.addedAt.getTime(),
                          )
                          .map(AnswerViewDto.mapToView) ?? [],
              }
            : null;
        return dto;
    }
}
