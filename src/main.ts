import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    appSetup(app); //глобальные настройки приложения
    app.enableCors();
    app.use(cookieParser());
    app.set('trust proxy', 1);

    const port = Number(process.env.PORT ?? 3000);

    await app.listen(port);
    Logger.log(`🚀 Swagger on: http://localhost:${port}/swagger`);
}
bootstrap();
