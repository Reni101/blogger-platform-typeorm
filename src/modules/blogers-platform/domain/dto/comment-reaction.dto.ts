import { LikeStatusEnum } from '../const/LikeStatusEnum';

export class CommentReactionDto {
    status: LikeStatusEnum;
    commentId: number;
    userId: number;
}
