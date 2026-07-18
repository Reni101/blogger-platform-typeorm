import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    ExpressAdapter,
    NestExpressApplication,
} from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';
import express from 'express';
import serverless from 'serverless-http';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
let cachedServer: serverless.Handler | null = null;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    appSetup(app); //глобальные настройки приложения
    app.enableCors();
    app.use(cookieParser());
    app.set('trust proxy', 1);
    const port = Number(process.env.PORT ?? 3000);

    await app.listen(port);
    Logger.log(`🚀 Swagger1 on: http://localhost:${port}/swagger`);
}

async function createServer(): Promise<serverless.Handler> {
    const expressApp = express();
    const adapter = new ExpressAdapter(expressApp);
    const app = await NestFactory.create<NestExpressApplication>(
        AppModule,
        adapter,
        {
            logger: ['error', 'warn', 'log'],
        },
    );
    appSetup(app);
    app.enableCors();
    app.use(cookieParser());
    app.set('trust proxy', 1);
    await app.init();
    return serverless(expressApp);
}

export default async function handler(
    req: express.Request,
    res: express.Response,
): Promise<void> {
    if (!cachedServer) {
        cachedServer = await createServer();
    }
    await cachedServer(req, res);
}

if (!process.env.VERCEL) {
    bootstrap();
}
