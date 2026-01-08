import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';

export class extendedLikesInfo {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatusEnum;
    newestLikes: {
        addedAt: Date;
        userId: string;
        login: string;
    }[];
}

export class PostViewDto {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: Date;
    extendedLikesInfo: extendedLikesInfo;

    static mapToView(post: any): PostViewDto {
        const dto = new PostViewDto();
        dto.id = post.id.toString();
        dto.title = post.title;
        dto.shortDescription = post.shortDescription;
        dto.content = post.content;
        dto.createdAt = post.createdAt;
        dto.blogId = post.blogId.toString();
        dto.blogName = post.blogName;
        dto.extendedLikesInfo = {
            likesCount: post.extendedLikesInfo.likesCount,
            dislikesCount: post.extendedLikesInfo.dislikesCount,
            myStatus: post.extendedLikesInfo.myStatus,
            newestLikes: post.extendedLikesInfo.newestLikes.map((l) => ({
                ...l,
                userId: l.userId.toString(),
            })),
        };
        return dto;
    }
}

export class PaginatedPostsViewDto extends PaginatedViewDto<PostViewDto[]> {
    @ApiProperty({ type: [PostViewDto] })
    items: PostViewDto[];
}
