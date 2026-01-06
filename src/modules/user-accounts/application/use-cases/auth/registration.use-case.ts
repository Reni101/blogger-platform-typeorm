import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserInputDto } from '../../../api/input-dto/user.input-dto';
import { UsersService } from '../../users.service';
import { CryptoService } from '../../crypto.service';
import { UsersRepository } from '../../../infastructure/users.repository';
import { EmailService } from '../../../../notifications/email.service';

export class RegistrationCommand {
    constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase implements ICommandHandler<RegistrationCommand> {
    constructor(
        private usersService: UsersService,
        private cryptoService: CryptoService,
        private usersRepository: UsersRepository,
        private emailService: EmailService,
    ) {}

    async execute({ dto }: RegistrationCommand) {
        const { login, email, password } = dto;
        await this.usersService.validateUniqueUser({ login, email });

        const passwordHash =
            await this.cryptoService.createPasswordHash(password);

        const user = await this.usersRepository.registerUser({
            login,
            email,
            passwordHash,
        });
        this.emailService
            .sendConfirmationEmail(
                user.email,
                user.emailConfirmation.confirmationCode,
            )
            .catch(console.error);
    }
}
