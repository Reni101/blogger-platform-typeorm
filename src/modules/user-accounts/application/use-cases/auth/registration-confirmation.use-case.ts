import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailConfirmationRepository } from '../../../infastructure/email-confirmation.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class RegistrationConfirmationCommand {
    constructor(public code: string) {}
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
    constructor(
        private emailConfirmationRepository: EmailConfirmationRepository,
    ) {}

    async execute({ code }: RegistrationConfirmationCommand) {
        const data = await this.emailConfirmationRepository.findByCode(code);
        if (!data) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'Incorrect code',
                extensions: [{ message: 'Incorrect code', field: 'code' }],
            });
        }
        if (data?.isConfirmed) {
            throw new DomainException({
                code: DomainExceptionCode.BadRequest,
                message: 'Email already confirmed',
                extensions: [
                    { message: 'Email already confirmed', field: 'code' },
                ],
            });
        }
        data.isConfirmed = true;
        await this.emailConfirmationRepository.save(data);
    }
}
