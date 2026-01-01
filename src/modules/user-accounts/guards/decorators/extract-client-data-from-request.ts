import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ClientContextDto } from '../dto/client-context.dto';

export const ExtractClientDataFromRequest = createParamDecorator(
    (data: unknown, context: ExecutionContext): ClientContextDto => {
        const req = context.switchToHttp().getRequest();

        const ip = ((req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress) ??
            '0.0.0.0') as string;
        const userAgent = (req.headers['user-agent'] ?? '') as string;

        return { ip, userAgent };
    },
);
