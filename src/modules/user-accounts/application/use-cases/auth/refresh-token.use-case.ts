import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionsService } from '../../sessions.service';
import { SessionsRepository } from '../../../infastructure/sessions.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from '../../dto/refresh-token-payload.dto';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';

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

    async execute({ refreshToken }: RefreshTokenCommand): Promise<{
        newAccessToken: string;
        newRefreshToken: string;
    }> {
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
        session.iat = iat.toString();
        session.exp = exp.toString();
        await this.sessionsRepository.save(session);

        return { newRefreshToken, newAccessToken };
    }
}
