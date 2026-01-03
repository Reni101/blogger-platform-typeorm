import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../../domain/dto/create-user.dto';
import { UsersService } from '../../users.service';
import { CryptoService } from '../../crypto.service';
import { UsersRepository } from '../../../infastructure/users.repository';
import { UserViewDto } from '../../../api/view-dto/user.view-dto';

export class CreateUserCommand {
    constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
    constructor(
        private usersService: UsersService,
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: CreateUserCommand) {
        const { login, email, password } = dto;

        await this.usersService.validateUniqueUser({ login, email });
        const passwordHash =
            await this.cryptoService.createPasswordHash(password);

        const user = await this.usersRepository.createUser({
            login,
            email,
            passwordHash,
        });
        return UserViewDto.mapToView(user);
    }
}
