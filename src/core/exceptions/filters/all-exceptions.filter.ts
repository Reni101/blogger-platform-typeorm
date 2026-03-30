import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseBody } from './error-response-body.type';
import { DomainExceptionCode } from '../domain-exception-codes';

//https://docs.nestjs.com/exception-filters#exception-filters-1
//Все ошибки
@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const message = exception.message || 'Unknown exception occurred.';
        const status =
            exception?.status === 429
                ? HttpStatus.TOO_MANY_REQUESTS
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const responseBody = this.buildResponseBody(request.url, message);
        response.status(status).json(responseBody);
    }

    private buildResponseBody(
        requestUrl: string,
        message: string,
    ): ErrorResponseBody {
        //TODO: Replace with getter from configService. will be in the following lessons
        const isProduction = process.env.NODE_ENV === 'production';

        if (isProduction) {
            return {
                timestamp: new Date().toISOString(),
                path: null,
                message: 'Some error occurred',
                code: DomainExceptionCode.InternalServerError,
                errorsMessages: [],
            };
        }

        return {
            timestamp: new Date().toISOString(),
            path: requestUrl,
            message,
            code: DomainExceptionCode.InternalServerError,
            errorsMessages: [],
        };
    }
}
