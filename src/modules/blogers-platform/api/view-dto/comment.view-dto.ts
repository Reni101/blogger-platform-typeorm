import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';

export class likesInfo {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusEnum;
}

export class CommentViewDto {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: Date;
    likesInfo: likesInfo;

    static mapToView(comment: any): CommentViewDto {
        const dto = new CommentViewDto();
        dto.id = comment.id.toString();
        dto.content = comment.content;
        dto.commentatorInfo = {
            userId: comment.commentatorInfo.userId.toString(),
            userLogin: comment.commentatorInfo.userLogin,
        };
        dto.createdAt = comment.createdAt;
        dto.likesInfo = {
            likesCount: comment.likesInfo.likesCount,
            dislikesCount: comment.likesInfo.dislikesCount,
            myStatus: comment.likesInfo.myStatus,
        };

        return dto;
    }
}

export class PaginatedCommentsViewDto extends PaginatedViewDto<
    CommentViewDto[]
> {
    @ApiProperty({ type: [CommentViewDto] })
    items: CommentViewDto[];
}
