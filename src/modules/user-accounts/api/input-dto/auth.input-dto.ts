import { IsEmail, IsString, IsUUID, Length } from 'class-validator';
import { Trim } from '../../../../core/decorators/transform/trim';
import { passwordConstraints } from '../../domain/user.entity';

export class RegistrationConfirmationInputDto {
    @Trim()
    @IsString()
    @IsUUID()
    code: string;
}

export class RegistrationEmailResendingInputDto {
    @Trim()
    @IsEmail()
    email: string;
}

export class PasswordRecoveryInputDto {
    @Trim()
    @IsEmail()
    email: string;
}

export class NewPasswordInputDto {
    @Trim()
    @IsString()
    @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
    newPassword: string;

    @Trim()
    @IsString()
    @IsUUID()
    recoveryCode: string;
}
