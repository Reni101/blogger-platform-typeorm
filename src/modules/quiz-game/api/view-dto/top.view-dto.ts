import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';

export class TopViewDto {
    sumScore: number;
    avgScores: number;
    gamesCount: number;
    winsCount: number;
    lossesCount: number;
    drawsCount: number;
    player: {
        id: string;
        login: string;
    };

    static mapToView(item: any) {
        const dto = new TopViewDto();
        dto.sumScore = Number(item.sumScore);
        dto.avgScores = parseFloat(Number(item.avgScores).toFixed(2));
        dto.gamesCount = item.gamesCount;
        dto.winsCount = item.winsCount;
        dto.lossesCount = item.lossesCount;
        dto.drawsCount = item.drawsCount;
        dto.player = {
            id: String(item.id),
            login: item.login,
        };
        return dto;
    }
}

export class PaginatedTopViewDto extends PaginatedViewDto<TopViewDto[]> {
    @ApiProperty({ type: [TopViewDto] })
    items: TopViewDto[];
}
