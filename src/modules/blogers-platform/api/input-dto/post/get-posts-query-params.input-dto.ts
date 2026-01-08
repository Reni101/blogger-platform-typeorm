import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PostSortBy } from './posts-sort-by';
import { IsEnum } from 'class-validator';

export class GetPostsQueryParams extends BaseQueryParams {
    @IsEnum(PostSortBy)
    sortBy = PostSortBy.CreatedAt;
}
