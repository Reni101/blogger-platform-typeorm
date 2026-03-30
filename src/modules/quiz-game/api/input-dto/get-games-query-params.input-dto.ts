import { IsEnum } from 'class-validator';
import { GamesSortBy } from './games-sort-by';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class GetGamesQueryParamsInputDto extends BaseQueryParams {
    @IsEnum(GamesSortBy)
    sortBy = GamesSortBy.PairCreatedDate;
}
