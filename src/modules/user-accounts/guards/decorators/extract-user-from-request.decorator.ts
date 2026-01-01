import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserContextDto } from '../dto/user-context.dto';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

export const ExtractUserFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext): UserContextDto => {
        const request = context.switchToHttp().getRequest();

        const user = request.user;
        if (!user) {
            throw new DomainException({
                message: 'there is no users in the request object!',
                code: DomainExceptionCode.BadRequest,
            });
        }

        return user;
    },
);
