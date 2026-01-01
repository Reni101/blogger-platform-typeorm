import { Module } from '@nestjs/common';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { StringValue } from 'ms';
import { CryptoService } from './application/crypto.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/user.entity';
import { EmailConfirmation } from './domain/email-confirmation.entity';
import { LoginUseCase } from './application/use-cases/auth/login.use-case';
import { AuthService } from './application/auth.service';
import { UsersRepository } from './infastructure/users.repository';
import { AuthController } from './api/auth.controller';
import { RegistrationUseCase } from './application/use-cases/auth/registration.use-case';
import { UsersService } from './application/users.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { Session } from './domain/session.entity';
import { SessionsRepository } from './infastructure/sessions.repository';

const useCases = [LoginUseCase, RegistrationUseCase];
const queries = [];

@Module({
    imports: [
        TypeOrmModule.forFeature([User, EmailConfirmation, Session]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('SECRET_KEY'),
                signOptions: {
                    expiresIn: config.getOrThrow<StringValue>(
                        'ACCESS_TOKEN_EXPIRE_IN',
                    ),
                },
            }),
        }),
        NotificationsModule,
    ],
    controllers: [AuthController],
    providers: [
        CryptoService,
        JwtStrategy,
        LocalStrategy,
        ...useCases,

        AuthService,
        // SessionsService,
        SessionsRepository,
        // SessionsQueryRepository,
        //
        UsersService,
        UsersRepository,
        // UsersQueryRepository,
    ],
    exports: [],
})
export class UserAccountsModule {}
