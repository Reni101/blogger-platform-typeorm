import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { SessionsRepository } from '../../../infastructure/sessions.repository';

export class LogoutCommand {
    constructor(public refreshToken?: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
    constructor(
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async execute({ refreshToken }: LogoutCommand) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);
        await this.sessionsRepository.deleteSession(session.id);
    }
}
