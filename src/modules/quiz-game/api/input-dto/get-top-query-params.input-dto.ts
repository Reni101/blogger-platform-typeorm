import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';

export class GetTopQueryParamsInputDto extends BaseQueryParams {
    @ApiProperty({
        type: [String],
        required: false,
        default: ['avgScores desc'],
        description: 'Default value : ?sort=avgScores desc&sort=sumScore desc',
    })
    @IsArray()
    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    sort: string[] = ['avgScores desc', 'sumScore desc'];
}
