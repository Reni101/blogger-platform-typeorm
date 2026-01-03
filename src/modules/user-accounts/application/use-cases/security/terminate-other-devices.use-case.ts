import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { SessionsRepository } from '../../../infastructure/sessions.repository';

export class TerminateOtherDevicesCommand {
    constructor(public refreshToken?: string) {}
}

@CommandHandler(TerminateOtherDevicesCommand)
export class TerminateOtherDevicesUseCase implements ICommandHandler<TerminateOtherDevicesCommand> {
    constructor(
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async execute({ refreshToken }: TerminateOtherDevicesCommand) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);
        await this.sessionsRepository.deleteOtherSessions({
            userId: session.userId,
            sessionId: session.id,
        });
    }
}
