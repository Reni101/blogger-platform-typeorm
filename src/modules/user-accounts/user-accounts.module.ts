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
import { Session } from './domain/session.entity';
import { SessionsRepository } from './infastructure/sessions.repository';
import { NotificationsModule } from '../notifications/notifications.module';
import { SaUsersController } from './api/sa.users.controller';
import { CreateUserUseCase } from './application/use-cases/admin/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/admin/delete-user.use-case';
import { GetUsersQueryHandler } from './application/queries/get-users.query';
import { UsersQueryRepository } from './infastructure/users-query.repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { GetDevicesQueryHandler } from './application/queries/get-devices.query';
import { SessionsService } from './application/sessions.service';
import { SessionsQueryRepository } from './infastructure/sessions-query.repository';
import { TerminateOtherDevicesUseCase } from './application/use-cases/security/terminate-other-devices.use-case';
import { TerminateDeviceUseCase } from './application/use-cases/security/terminate-device.use-case';

const useCases = [
    LoginUseCase,
    RegistrationUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    TerminateOtherDevicesUseCase,
    TerminateDeviceUseCase,
];
const queries = [GetUsersQueryHandler, GetDevicesQueryHandler];

@Module({
    imports: [
        NotificationsModule,
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
    ],
    controllers: [AuthController, SaUsersController, SecurityDevicesController],
    providers: [
        CryptoService,
        JwtStrategy,
        LocalStrategy,
        ...useCases,
        ...queries,

        AuthService,

        SessionsService,
        SessionsRepository,
        SessionsQueryRepository,

        UsersService,
        UsersRepository,
        UsersQueryRepository,
    ],
    exports: [],
})
export class UserAccountsModule {}
