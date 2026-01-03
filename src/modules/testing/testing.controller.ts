import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('testing')
export class TestingController {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    @Delete('all-data')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        await this.dataSource.query(
            'TRUNCATE TABLE "users" RESTART IDENTITY CASCADE;',
        );
        await this.dataSource.query(
            'TRUNCATE TABLE "sessions" RESTART IDENTITY;',
        );
        await this.dataSource.query(
            'TRUNCATE TABLE "email_confirmation" RESTART IDENTITY CASCADE;',
        );
        // await this.dataSource.query(
        //     'TRUNCATE TABLE "Posts" RESTART IDENTITY CASCADE;',
        // );
        // await this.dataSource.query(
        //     'TRUNCATE TABLE "Blogs" RESTART IDENTITY CASCADE;',
        // );
        // await this.dataSource.query(
        //     'TRUNCATE TABLE "Comments" RESTART IDENTITY CASCADE;',
        // );
        // await this.dataSource.query(
        //     'TRUNCATE TABLE "PostsReactions" RESTART IDENTITY CASCADE;',
        // );
        // await this.dataSource.query(
        //     'TRUNCATE TABLE "CommentsReactions" RESTART IDENTITY CASCADE;',
        // );

        return {
            status: 'succeeded',
        };
    }
}
