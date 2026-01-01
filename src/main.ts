import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { appSetup } from './setup/app.setup';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const config = app.get(ConfigService);
    appSetup(app); //глобальные настройки приложения
    app.enableCors();
    app.use(cookieParser());
    app.set('trust proxy', 'loopback');

    const port = config.getOrThrow<string>('PORT');

    await app.listen(+port);
    Logger.log(`🚀 Swagger on: http://localhost:${port}/swagger`);
}
bootstrap();
