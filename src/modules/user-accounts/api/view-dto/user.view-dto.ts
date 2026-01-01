import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../domain/user.entity';

export class UserViewDto {
    id: string;
    login: string;
    email: string;
    createdAt: string;

    static mapToView(user: User): UserViewDto {
        const dto = new UserViewDto();

        dto.email = user.email;
        dto.login = user.login;
        dto.id = user.id.toString();
        dto.createdAt = user.createdAt.toISOString();
        return dto;
    }
}

export class PaginatedUsersViewDto extends PaginatedViewDto<UserViewDto[]> {
    @ApiProperty({ type: [UserViewDto] })
    items: UserViewDto[];
}

export class MeInfo {
    id: string;
    login: string;
    email: string;
}
