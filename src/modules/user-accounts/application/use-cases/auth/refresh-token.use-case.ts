import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { RefreshTokenPayload } from '../../dto/refresh-token-payload.dto';
import { SessionsRepository } from '../../../infastructure/sessions.repository';

export class RefreshTokenCommand {
    constructor(public refreshToken?: string) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase implements ICommandHandler<RefreshTokenCommand> {
    constructor(
        private configService: ConfigService,
        private sessionsService: SessionsService,
        private sessionsRepository: SessionsRepository,
        private jwtService: JwtService,
    ) {}

    async execute({ refreshToken }: RefreshTokenCommand) {
        const session =
            await this.sessionsService.checkRefreshToken(refreshToken);
        const { deviceId, userId } = session;
        const newAccessToken = this.jwtService.sign({
            id: userId.toString(),
            deviceId,
        });

        const newRefreshToken = this.jwtService.sign(
            { id: userId.toString(), deviceId },
            {
                expiresIn: this.configService.getOrThrow<StringValue>(
                    'REFRESH_TOKEN_EXPIRE_IN',
                ),
            },
        );

        const { iat, exp } =
            this.jwtService.decode<RefreshTokenPayload>(newRefreshToken);
        session.iat = iat;
        session.exp = exp;
        await this.sessionsRepository.save(session);

        return { newRefreshToken, newAccessToken };
    }
}
