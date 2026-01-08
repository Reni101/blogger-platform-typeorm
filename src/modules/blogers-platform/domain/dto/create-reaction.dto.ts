import { LikeStatusEnum } from '../const/LikeStatusEnum';

export class CreateReactionDto {
    status: LikeStatusEnum;
    userId: number;
    domainId: number;
}
