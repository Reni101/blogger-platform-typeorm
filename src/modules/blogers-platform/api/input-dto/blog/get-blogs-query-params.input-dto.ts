import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class GetBlogsQueryParams extends BaseQueryParams {
    @IsEnum(BlogsSortBy)
    sortBy = BlogsSortBy.CreatedAt;

    @Trim()
    @IsString()
    @IsOptional()
    searchNameTerm?: string | null = null;
}
