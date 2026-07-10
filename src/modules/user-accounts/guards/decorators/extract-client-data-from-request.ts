import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientContextDto } from '../dto/client-context.dto';
import { parseUserAgent } from '../utils/parse-user-agent';

export const ExtractClientDataFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext): ClientContextDto => {
        const req = context.switchToHttp().getRequest();

        const ip = ((req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress) ??
            '0.0.0.0') as string;
        const userMobile = (req.headers['x-device-name'] ?? '') as
            | string
            | undefined;
        const userWeb = (req.headers['user-agent'] ?? '') as string;
        const parsedUserWeb = userWeb ? parseUserAgent(userWeb) : '';

        return { ip, userAgent: userMobile ? userMobile : parsedUserWeb };
    },
);
