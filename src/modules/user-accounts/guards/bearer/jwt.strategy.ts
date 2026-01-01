import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as process from 'node:process';
import { UserContextDto } from '../dto/user-context.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY ?? '123',
        });
    }

    /**
     * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
     * @param payload
     */
    async validate(payload: { id: number }): Promise<UserContextDto> {
        return { id: payload.id };
    }
}
