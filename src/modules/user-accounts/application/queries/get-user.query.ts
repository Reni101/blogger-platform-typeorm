import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from '../../infastructure/quey/users-query.repository';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

export class GetUserQuery {
    constructor(public id: number) {}
}

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
    constructor(private usersQueryRepository: UsersQueryRepository) {}

    async execute({ id }: GetUserQuery) {
        const user = await this.usersQueryRepository.getUserById(id);
        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'user not found',
            });
        }
        return {
            email: user.email,
            login: user.login,
            userId: user.id.toString(),
            isEmailConfirm: user.emailConfirmation.isConfirmed,
        };
    }
}
