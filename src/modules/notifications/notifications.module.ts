import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: 'smtp.mail.ru',
                    port: 465,
                    secure: true, // true для 465, false для других портов
                    auth: {
                        user: config.getOrThrow<string>('EMAIL'),
                        pass: config.getOrThrow<string>('PASS'),
                    },
                },
                defaults: { from: process.env.EMAIL },
            }),
        }),
    ],
    controllers: [],
    providers: [EmailService],
    exports: [EmailService],
})
export class NotificationsModule {}
