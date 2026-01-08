import { IsEnum } from 'class-validator';
import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';

export class likeStatusInputDto {
    @IsEnum(LikeStatusEnum)
    likeStatus: LikeStatusEnum;
}
