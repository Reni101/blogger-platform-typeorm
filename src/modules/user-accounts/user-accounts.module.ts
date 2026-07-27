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
import { SaUsersController } from './api/sa.users.controller';
import { CreateUserUseCase } from './application/use-cases/admin/create-user.use-case';
import { DeleteUserUseCase } from './application/use-cases/admin/delete-user.use-case';
import { GetUsersQueryHandler } from './application/queries/get-users.query';
import { UsersQueryRepository } from './infastructure/quey/users-query.repository';
import { SecurityDevicesController } from './api/security-devices.controller';
import { GetDevicesQueryHandler } from './application/queries/get-devices.query';
import { SessionsService } from './application/sessions.service';
import { TerminateOtherDevicesUseCase } from './application/use-cases/security/terminate-other-devices.use-case';
import { TerminateDeviceUseCase } from './application/use-cases/security/terminate-device.use-case';
import { LogoutUseCase } from './application/use-cases/auth/logout.use-case';
import { RegistrationConfirmationUseCase } from './application/use-cases/auth/registration-confirmation.use-case';
import { EmailConfirmationRepository } from './infastructure/email-confirmation.repository';
import { RegistrationEmailResendingUseCase } from './application/use-cases/auth/registration-email-resending.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/auth/password-recovery.use-case';
import { NewPasswordUseCase } from './application/use-cases/auth/new-password.use-case';
import { RefreshTokenUseCase } from './application/use-cases/auth/refresh-token.use-case';
import { GetUserQueryHandler } from './application/queries/get-user.query';
import { UserController } from './api/user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAvatar, UserAvatarSchema } from './domain/user-avatar.schema';
import { UploadAvatarUseCase } from './application/use-cases/user/upload-avatar.use-case';
import { UserAvatarRepository } from './infastructure/user-avatar.repository';
import { Session, SessionSchema } from './domain/session.schema';
import { SessionsQueryRepository } from './infastructure/quey/sessions-query.repository';
import { SessionsRepository } from './infastructure/sessions.repository';

const useCases = [
    LoginUseCase,
    RegistrationUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    TerminateOtherDevicesUseCase,
    TerminateDeviceUseCase,
    LogoutUseCase,
    RegistrationConfirmationUseCase,
    RegistrationEmailResendingUseCase,
    PasswordRecoveryUseCase,
    NewPasswordUseCase,
    RefreshTokenUseCase,
    UploadAvatarUseCase,
];
const queries = [
    GetUsersQueryHandler,
    GetDevicesQueryHandler,
    GetUserQueryHandler,
];

@Module({
    imports: [
        NotificationsModule,
        MongooseModule.forFeature([
            { name: UserAvatar.name, schema: UserAvatarSchema },
            { name: Session.name, schema: SessionSchema },
        ]),
        TypeOrmModule.forFeature([User, EmailConfirmation]),
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
    controllers: [
        AuthController,
        UserController,
        SaUsersController,
        SecurityDevicesController,
    ],
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

        EmailConfirmationRepository,

        UserAvatarRepository,
    ],
    exports: [],
})
export class UserAccountsModule {}
