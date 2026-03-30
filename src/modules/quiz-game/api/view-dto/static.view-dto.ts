export class StaticViewDto {
    sumScore: number;
    avgScores: number;
    gamesCount: number;
    winsCount: number;
    lossesCount: number;
    drawsCount: number;

    // static mapToView(a: Answer): AnswerViewDto {
    //     const dto = new AnswerViewDto();
    //     dto.questionId = a.questionId.toString();
    //     dto.answerStatus = a.status;
    //     dto.addedAt = a.addedAt;
    //     return dto;
    // }
}
