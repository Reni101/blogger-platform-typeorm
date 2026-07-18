import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infastructure/users-query.repository';
import { GetUsersQueryParams } from '../../api/input-dto/get-users-query-params.input-dto';
import { UserViewDto } from '../../api/view-dto/user.view-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';

export class GetUsersQuery {
    constructor(public query: GetUsersQueryParams) {}
}

@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute({ query }: GetUsersQuery) {
        const result = await this.usersQueryRepository.getUsers(query);
        return PaginatedViewDto.mapToView({
            items: result[0].map(UserViewDto.mapToView),
            totalCount: result[1],
            page: query.pageNumber,
            size: query.pageSize,
        });
    }
}
