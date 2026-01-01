import { Injectable } from '@nestjs/common';
import {
    DomainException,
    Extension,
} from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { UsersRepository } from '../infastructure/users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async validateUniqueUser(dto: { login: string; email: string }) {
        const uniqueUser = await this.usersRepository.findUniqueUser(
            dto.login,
            dto.email,
        );

        if (uniqueUser) {
            const extensions: Extension[] = [];
            if (uniqueUser.login === dto.login) {
                extensions.push({
                    field: 'login',
                    message: 'login already exists',
                });
            }
            if (uniqueUser.email === dto.email) {
                extensions.push({
                    field: 'email',
                    message: 'email already exists',
                });
            }

            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'error creating users',
                extensions,
            });
        }
    }
}
