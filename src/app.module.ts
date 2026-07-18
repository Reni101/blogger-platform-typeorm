import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CqrsModule } from '@nestjs/cqrs';
import { APP_FILTER } from '@nestjs/core';
import { AllHttpExceptionsFilter } from './core/exceptions/filters/all-exceptions.filter';
import { DomainHttpExceptionsFilter } from './core/exceptions/filters/domain-exceptions.filter';
import { TestingModule } from './modules/testing/testing.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsModule } from './modules/user-accounts/user-accounts.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { BlogPlatformModule } from './modules/blogers-platform/bloger-platform.module';
import { QuizGameModule } from './modules/quiz-game/quiz-game.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CqrsModule.forRoot(),
        ThrottlerModule.forRoot({
            throttlers: [{ limit: 5, ttl: 10000 }],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                return {
                    type: 'postgres' as const,
                    url: config.getOrThrow<string>('PG_URL'),
                    autoLoadEntities: true,
                    synchronize: false,
                };
            },
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.getOrThrow<string>('MONGO_URL'),
                dbName: 'blogger-platform',
            }),
        }),
        ScheduleModule.forRoot(),

        TestingModule,
        NotificationsModule,
        UserAccountsModule,
        BlogPlatformModule,
        QuizGameModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllHttpExceptionsFilter,
        },
        {
            provide: APP_FILTER,
            useClass: DomainHttpExceptionsFilter,
        },
    ],
    exports: [NotificationsModule],
})
export class AppModule {}
