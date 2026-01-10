import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';

interface IRawBlog {
    b_id: number;
    b_name: string;
    b_description: string;
    b_websiteUrl: string;
    b_isMembership: boolean;
    b_createdAt: Date;
}

export class BlogViewDto {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: Date;
    isMembership: boolean;

    static mapToView(blog: IRawBlog): BlogViewDto {
        const dto = new BlogViewDto();
        dto.id = blog.b_id.toString();
        dto.name = blog.b_name;
        dto.description = blog.b_description;
        dto.websiteUrl = blog.b_websiteUrl;
        dto.createdAt = blog.b_createdAt;
        dto.isMembership = blog.b_isMembership;
        return dto;
    }
}

export class PaginatedBlogsViewDto extends PaginatedViewDto<BlogViewDto[]> {
    @ApiProperty({ type: [BlogViewDto] })
    items: BlogViewDto[];
}
