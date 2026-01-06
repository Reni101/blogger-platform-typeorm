import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../infastructure/users.repository';
import { EmailService } from '../../../../notifications/email.service';
import { v4 as uuid } from 'uuid';

export class PasswordRecoveryCommand {
    constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
    constructor(
        private readonly usersRepository: UsersRepository,
        private emailService: EmailService,
    ) {}

    async execute({ email }: PasswordRecoveryCommand) {
        const user = await this.usersRepository.findByEmailOrThrow(email);

        const code = uuid();
        user.recoveryCode = code;
        await this.usersRepository.save(user);
        this.emailService
            .passwordRecoveryEmail(user.email, code)
            .catch(console.error);
    }
}
