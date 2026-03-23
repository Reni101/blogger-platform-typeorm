import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import {
    ApiBearerAuth,
    ApiBody,
    ApiCookieAuth,
    ApiResponse,
} from '@nestjs/swagger';
import { loginApiSchema, loginResSchema } from './input-dto/api';
import { ExtractUserFromRequest } from '../guards/decorators/extract-user-from-request.decorator';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { ExtractClientDataFromRequest } from '../guards/decorators/extract-client-data-from-request';
import { ClientContextDto } from '../guards/dto/client-context.dto';
import { LoginCommand } from '../application/use-cases/auth/login.use-case';
// import { ThrottlerGuard } from '@nestjs/throttler';
import { CreateUserInputDto } from './input-dto/user.input-dto';
import { RegistrationCommand } from '../application/use-cases/auth/registration.use-case';
import { ExtractRefreshTokenFromRequest } from '../guards/decorators/extract-refresh-token-from-request';
import { LogoutCommand } from '../application/use-cases/auth/logout.use-case';
import {
    NewPasswordInputDto,
    PasswordRecoveryInputDto,
    RegistrationConfirmationInputDto,
    RegistrationEmailResendingInputDto,
} from './input-dto/auth.input-dto';
import { RegistrationConfirmationCommand } from '../application/use-cases/auth/registration-confirmation.use-case';
import { RegistrationEmailResendingCommand } from '../application/use-cases/auth/registration-email-resending.use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/auth/password-recovery.use-case';
import { NewPasswordCommand } from '../application/use-cases/auth/new-password.use-case';
import { RefreshTokenCommand } from '../application/use-cases/auth/refresh-token.use-case';
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { MeInfo } from './view-dto/user.view-dto';
import { GetUserQuery } from '../application/queries/get-user.query';

@Controller('auth')
export class AuthController {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiBody({ schema: loginApiSchema })
    @ApiResponse({ schema: loginResSchema })
    @Post('login')
    async login(
        @ExtractUserFromRequest() user: UserContextDto,
        @ExtractClientDataFromRequest() client: ClientContextDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { accessToken, refreshToken } = await this.commandBus.execute<
            LoginCommand,
            { accessToken: string; refreshToken: string }
        >(
            new LoginCommand({
                deviceName: client.userAgent,
                userId: user.id,
                ip: client.ip,
            }),
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return { accessToken };
    }

    // @UseGuards(ThrottlerGuard)
    @Post('registration')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registration(@Body() body: CreateUserInputDto) {
        return this.commandBus.execute<RegistrationCommand, void>(
            new RegistrationCommand(body),
        );
    }

    @ApiCookieAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response,
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
    ) {
        await this.commandBus.execute<LogoutCommand, void>(
            new LogoutCommand(refreshToken),
        );

        res.clearCookie('refreshToken', { path: '/' });
        return;
    }

    // @UseGuards(ThrottlerGuard)
    @Post('registration-confirmation')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationConfirmation(
        @Body() body: RegistrationConfirmationInputDto,
    ) {
        return this.commandBus.execute<RegistrationConfirmationCommand, void>(
            new RegistrationConfirmationCommand(body.code),
        );
    }

    // @UseGuards(ThrottlerGuard)
    @Post('registration-email-resending')
    @HttpCode(HttpStatus.NO_CONTENT)
    async registrationEmailResending(
        @Body() body: RegistrationEmailResendingInputDto,
    ) {
        return this.commandBus.execute<RegistrationEmailResendingCommand, void>(
            new RegistrationEmailResendingCommand(body.email),
        );
    }

    // @UseGuards(ThrottlerGuard)
    @Post('password-recovery')
    @HttpCode(HttpStatus.NO_CONTENT)
    async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
        return this.commandBus.execute<PasswordRecoveryCommand, void>(
            new PasswordRecoveryCommand(body.email),
        );
    }

    // @UseGuards(ThrottlerGuard)
    @Post('new-password')
    @HttpCode(HttpStatus.NO_CONTENT)
    async newPassword(@Body() body: NewPasswordInputDto) {
        return this.commandBus.execute<NewPasswordCommand, void>(
            new NewPasswordCommand(body),
        );
    }

    // @UseGuards(ThrottlerGuard)
    @ApiCookieAuth()
    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refreshToken(
        @ExtractRefreshTokenFromRequest() refreshToken: string | undefined,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { newAccessToken, newRefreshToken } =
            await this.commandBus.execute<
                RefreshTokenCommand,
                { newAccessToken: string; newRefreshToken: string }
            >(new RefreshTokenCommand(refreshToken));

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
        });
        return { accessToken: newAccessToken };
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('me')
    async me(@ExtractUserFromRequest() user: UserContextDto) {
        return this.queryBus.execute<GetUserQuery, MeInfo>(
            new GetUserQuery(user.id),
        );
    }
}
