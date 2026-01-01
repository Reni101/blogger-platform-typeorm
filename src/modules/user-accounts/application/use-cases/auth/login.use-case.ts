import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { v4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { SessionsRepository } from '../../../infastructure/sessions.repository';
import { RefreshTokenPayload } from '../../dto/refresh-token-payload.dto';

export class LoginCommand {
    constructor(
        public dto: { userId: number; deviceName: string; ip: string },
    ) {}
}

@CommandHandler(LoginCommand)
export class LoginUseCase implements ICommandHandler<LoginCommand> {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async execute({ dto }: LoginCommand) {
        const { deviceName, ip, userId } = dto;
        const deviceId = v4();
        const accessToken = this.jwtService.sign({ id: dto.userId, deviceId });

        const refreshToken = this.jwtService.sign(
            { id: dto.userId, deviceId },
            {
                expiresIn: this.configService.getOrThrow<StringValue>(
                    'REFRESH_TOKEN_EXPIRE_IN',
                ),
            },
        );
        const { iat, exp } =
            this.jwtService.decode<RefreshTokenPayload>(refreshToken);

        await this.sessionsRepository.createSession({
            userId,
            deviceName,
            ip,
            deviceId: v4(),
            iat,
            exp,
        });

        return {
            accessToken,
            refreshToken,
        };
    }
}
