import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractRefreshTokenFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext): string | undefined => {
        const req = context.switchToHttp().getRequest();
        const mobileRefreshToken = (req.headers['x-mobile-refresh-token'] ??
            '') as string | undefined;

        return mobileRefreshToken
            ? mobileRefreshToken
            : req.cookies.refreshToken;
    },
);
