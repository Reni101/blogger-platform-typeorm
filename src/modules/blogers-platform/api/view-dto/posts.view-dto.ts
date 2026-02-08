import { LikeStatusEnum } from '../../domain/const/LikeStatusEnum';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';

export interface IRawPost {
    b_name: string;
    p_blogId: number;
    p_content: string;
    p_createdAt: Date;
    p_id: number;
    p_shortDescription: string;
    p_title: string;
}

export class ExtendedLikesInfo {
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
    extendedLikesInfo: ExtendedLikesInfo;

    static mapToView(post: IRawPost): PostViewDto {
        const dto = new PostViewDto();
        dto.id = post.p_id.toString();
        dto.title = post.p_title;
        dto.shortDescription = post.p_shortDescription;
        dto.content = post.p_content;
        dto.createdAt = post.p_createdAt;
        dto.blogId = post.p_blogId.toString();
        dto.blogName = post.b_name;
        dto.extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatusEnum.None,
            newestLikes: [],
        };
        return dto;
    }
}

export class PaginatedPostsViewDto extends PaginatedViewDto<PostViewDto[]> {
    @ApiProperty({ type: [PostViewDto] })
    items: PostViewDto[];
}
