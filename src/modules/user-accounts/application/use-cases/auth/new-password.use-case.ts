import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordInputDto } from '../../../api/input-dto/auth.input-dto';
import { UsersRepository } from '../../../infastructure/users.repository';
import { CryptoService } from '../../crypto.service';

export class NewPasswordCommand {
    constructor(public dto: NewPasswordInputDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
    constructor(
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) {}

    async execute({ dto }: NewPasswordCommand) {
        const { recoveryCode, newPassword } = dto;
        const user =
            await this.usersRepository.findByRecoveryCodeOrThrow(recoveryCode);

        user.passwordHash =
            await this.cryptoService.createPasswordHash(newPassword);
        await this.usersRepository.save(user);
    }
}
