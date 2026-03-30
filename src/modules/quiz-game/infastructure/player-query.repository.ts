import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player, PlayerStatus } from '../domain/player.entity';
import { Repository } from 'typeorm';
import { StatisticViewDto } from '../api/view-dto/statistic.view-dto';
import { GetTopQueryParamsInputDto } from '../api/input-dto/get-top-query-params.input-dto';
import { PaginatedTopViewDto, TopViewDto } from '../api/view-dto/top.view-dto';
import { PaginatedViewDto } from '../../../core/dto/base.paginated.view-dto';

@Injectable()
export class PlayerQueryRepository {
    constructor(
        @InjectRepository(Player) private playersRepository: Repository<Player>,
    ) {}

    async getUserStatic(userId: number): Promise<StatisticViewDto> {
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

        const dto = new StatisticViewDto();
        dto.sumScore = Number(result.sumScore);
        dto.avgScores = parseFloat(Number(result.avgScores).toFixed(2));
        dto.gamesCount = result.gamesCount;
        dto.winsCount = result.winsCount;
        dto.lossesCount = result.lossesCount;
        dto.drawsCount = result.drawsCount;

        return dto;
    }

    async getTop(
        query: GetTopQueryParamsInputDto,
    ): Promise<PaginatedTopViewDto> {
        const qb = this.playersRepository
            .createQueryBuilder('p')
            .select('p.userId', 'id')
            .addSelect('u.login', 'login')
            .addSelect('COALESCE(SUM(p.score), 0)', 'sumScore')
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
            .innerJoin('p.user', 'u')
            .groupBy('p.userId')
            .addGroupBy('u.login');

        const validSortFields = new Set([
            'sumScore',
            'avgScores',
            'gamesCount',
            'winsCount',
            'lossesCount',
            'drawsCount',
        ]);

        const sortParams =
            query.sort.length > 0
                ? query.sort
                : ['avgScores desc', 'sumScore desc'];

        sortParams.forEach((sortItem, index) => {
            const [field, direction] = sortItem.split(' ');
            if (!validSortFields.has(field)) return;
            const dir = direction?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
            if (index === 0) {
                qb.orderBy(`"${field}"`, dir);
            } else {
                qb.addOrderBy(`"${field}"`, dir);
            }
        });

        const totalCountResult = await this.playersRepository
            .createQueryBuilder('p')
            .select('COUNT(DISTINCT p.userId)', 'count')
            .getRawOne();
        const totalCount = Number(totalCountResult.count);

        const rawItems = await qb
            .offset(query.calculateSkip())
            .limit(query.pageSize)
            .getRawMany();
        return PaginatedViewDto.mapToView({
            items: rawItems.map(TopViewDto.mapToView),
            totalCount,
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
