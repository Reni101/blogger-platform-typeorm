import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player, PlayerStatus } from '../domain/player.entity';
import { Repository } from 'typeorm';
import { StaticViewDto } from '../api/view-dto/static.view-dto';

@Injectable()
export class PlayerQueryRepository {
    constructor(
        @InjectRepository(Player) private playersRepository: Repository<Player>,
    ) {}

    async getUserStatic(userId: number): Promise<StaticViewDto> {
        const result = await this.playersRepository
            .createQueryBuilder('p')
            .select('COALESCE(SUM(p.score), 0)', 'sumScore')
            .addSelect('COALESCE(AVG(p.score), 0)', 'avgScores')
            .addSelect('COUNT(*)::int', 'gamesCount')
            .addSelect(
                `COUNT(*) FILTER (WHERE p.status = '${PlayerStatus.Win}')::int`,
                'winsCount',
            )
            .addSelect(
                `COUNT(*) FILTER (WHERE p.status = '${PlayerStatus.Lose}')::int`,
                'lossesCount',
            )
            .addSelect(
                `COUNT(*) FILTER (WHERE p.status = '${PlayerStatus.Draw}')::int`,
                'drawsCount',
            )
            .where('p.userId = :userId', { userId })
            .getRawOne();

        const dto = new StaticViewDto();
        dto.sumScore = Number(result.sumScore);
        dto.avgScores = parseFloat(Number(result.avgScores).toFixed(2));
        dto.gamesCount = result.gamesCount;
        dto.winsCount = result.winsCount;
        dto.lossesCount = result.lossesCount;
        dto.drawsCount = result.drawsCount;

        return dto;
    }
}
