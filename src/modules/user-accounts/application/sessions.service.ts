import { Injectable } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenPayload } from './dto/refresh-token-payload.dto';
import { SessionsRepository } from '../infastructure/sessions.repository';

@Injectable()
export class SessionsService {
    constructor(
        private jwtService: JwtService,
        private sessionsRepository: SessionsRepository,
    ) {}

    async checkRefreshToken(refreshToken: string | undefined) {
        if (!refreshToken) {
            throw new DomainException({
                message: 'no refresh token',
                code: DomainExceptionCode.Unauthorized,
            });
        }
        const token = this.jwtService.decode<RefreshTokenPayload>(refreshToken);
        const session = await this.sessionsRepository.findOrThrow({
            iat: token.iat.toString(),
            deviceId: token.deviceId,
        });
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime > +session.exp) {
            await this.sessionsRepository.deleteSession(session.id);
            throw new DomainException({
                message: 'refresh token is expired',
                code: DomainExceptionCode.Unauthorized,
            });
        }
        return session;
    }
}
