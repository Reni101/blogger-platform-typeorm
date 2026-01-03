import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { v4 } from 'uuid';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User) private usersRepository: Repository<User>,
    ) {}

    async findById(id: number) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findByLoginOrEmail(loginOrEmail: string) {
        return this.usersRepository.findOne({
            where: [{ login: loginOrEmail }, { email: loginOrEmail }],
        });
    }

    async findByIdOrThrow(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.NotFound,
                message: 'user not found',
            });
        }
        return user;
    }

    async findUniqueUser(login: string, email: string) {
        return this.usersRepository.findOne({
            where: [{ login }, { email }],
        });
    }
    async createUser(dto: CreateUserDomainDto) {
        const user = this.usersRepository.create({
            login: dto.login,
            email: dto.email,
            passwordHash: dto.passwordHash,
            confirmationCode: v4(),
        });
        await this.usersRepository.save(user);

        return user;
    }

    async save(user: User) {
        return this.usersRepository.save(user);
    }
}
