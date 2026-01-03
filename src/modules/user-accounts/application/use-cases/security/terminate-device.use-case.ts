import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { SessionsRepository } from '../../../infastructure/sessions.repository';
import { DomainException } from '../../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../../core/exceptions/domain-exception-codes';

export class TerminateDeviceCommand {
    constructor(public dto: { refreshToken?: string; deviceId: string }) {}
}

@CommandHandler(TerminateDeviceCommand)
export class TerminateDeviceUseCase implements ICommandHandler<TerminateDeviceCommand> {
    constructor(
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async execute({ dto }: TerminateDeviceCommand) {
        const currentSession = await this.sessionsService.checkRefreshToken(
            dto.refreshToken,
        );

        const sessionForDelete =
            await this.sessionsRepository.findByDeviceIdOrThrow(dto.deviceId);

        if (+sessionForDelete.userId !== +currentSession.userId) {
            throw new DomainException({
                message: 'forbidden delete the session',
                code: DomainExceptionCode.Forbidden,
            });
        }

        await this.sessionsRepository.deleteSession(sessionForDelete.id);
    }
}
