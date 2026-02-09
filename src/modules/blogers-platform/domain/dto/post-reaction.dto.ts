import { LikeStatusEnum } from '../const/LikeStatusEnum';

export class PostReactionDto {
    status: LikeStatusEnum;
    postId: number;
    userId: number;
}
