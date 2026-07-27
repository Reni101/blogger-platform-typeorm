import { MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';
import { DomainException } from '../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../core/exceptions/domain-exception-codes';

export const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;

export const uploadAvatarFilePipe = new ParseFilePipe({
    validators: [new MaxFileSizeValidator({ maxSize: MAX_AVATAR_SIZE_BYTES })],
    exceptionFactory: (error) =>
        new DomainException({
            code: DomainExceptionCode.ValidationError,
            message: 'Validation failed',
            extensions: [{ field: 'file', message: error }],
        }),
});
