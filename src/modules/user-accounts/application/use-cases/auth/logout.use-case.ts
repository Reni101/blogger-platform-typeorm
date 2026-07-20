import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';

export class LogoutCommand {
    constructor(public refreshToken?: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutUseCase implements ICommandHandler<LogoutCommand> {
    constructor(private sessionsService: SessionsService) {}

    async execute({ refreshToken }: LogoutCommand) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);
        await session.deleteOne();
    }
}
