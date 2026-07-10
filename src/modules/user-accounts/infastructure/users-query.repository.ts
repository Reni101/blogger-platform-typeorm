import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { GetUsersQueryParams } from '../api/input-dto/get-users-query-params.input-dto';
import { SortDirection } from '../../../core/dto/base.query-params.input-dto';

@Injectable()
export class UsersQueryRepository {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    async getUsers(query: GetUsersQueryParams) {
        const queryBuilder = this.usersRepository
            .createQueryBuilder('u')
            .select(['u.id', 'u.login', 'u.email', 'u.createdAt'])
            .limit(query.pageSize)
            .offset(query.calculateSkip())
            .orderBy(
                `u.${query.sortBy}`,
                query.sortDirection === SortDirection.Asc ? 'ASC' : 'DESC',
            );

        if (query.searchLoginTerm) {
            queryBuilder.orWhere('u.login ILIKE :login', {
                login: `%${query.searchLoginTerm}%`,
            });
        }
        if (query.searchEmailTerm) {
            queryBuilder.orWhere('u.email ILIKE :email', {
                email: `%${query.searchEmailTerm}%`,
            });
        }

        return queryBuilder.getManyAndCount();
    }
    getUserById(id: number) {
        return this.usersRepository.findOne({
            select: {
                id: true,
                email: true,
                login: true,
                emailConfirmation: { isConfirmed: true },
            },
            where: { id },
            relations: { emailConfirmation: true },
        });
    }
}
