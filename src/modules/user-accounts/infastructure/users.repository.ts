import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { Repository } from 'typeorm';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { CreateUserDomainDto } from '../domain/dto/create-user.domain.dto';
import { v4 } from 'uuid';
import { add } from 'date-fns';

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
        });
        await this.usersRepository.save(user);

        return user;
    }
    async registerUser(dto: CreateUserDomainDto) {
        const user = this.usersRepository.create({
            login: dto.login,
            email: dto.email,
            passwordHash: dto.passwordHash,
            emailConfirmation: {
                confirmationCode: v4(),
                expirationDate: add(new Date(), {
                    days: 1,
                }),
                isConfirmed: false,
            },
        });
        await this.usersRepository.save(user);

        return user;
    }
    async findByEmailOrThrow(email: string) {
        const user = await this.usersRepository.findOne({
            relations: { emailConfirmation: true },
            where: { email },
        });

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'email not found',
                extensions: [{ message: 'email doesnt exist', field: 'email' }],
            });
        }
        return user;
    }
    async findByRecoveryCodeOrThrow(recoveryCode: string) {
        const user = await this.usersRepository.findOneBy({ recoveryCode });

        if (!user) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'users not found',
                extensions: [
                    {
                        message: 'RecoveryCode doesnt exist',
                        field: 'recoveryCode',
                    },
                ],
            });
        }
        return user;
    }
    async save(user: User) {
        return this.usersRepository.save(user);
    }
}
