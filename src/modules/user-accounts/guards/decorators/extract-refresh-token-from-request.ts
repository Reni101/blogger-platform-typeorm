import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractRefreshTokenFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext): string | undefined => {
        const req = context.switchToHttp().getRequest();

        return req.cookies.refreshToken;
    },
);
