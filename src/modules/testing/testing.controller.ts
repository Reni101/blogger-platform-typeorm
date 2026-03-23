import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('test')
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
        await this.dataSource.query(
            'TRUNCATE TABLE "posts" RESTART IDENTITY CASCADE;',
        );
        await this.dataSource.query(
            'TRUNCATE TABLE "blogs" RESTART IDENTITY CASCADE;',
        );
        await this.dataSource.query(
            'TRUNCATE TABLE "comments" RESTART IDENTITY CASCADE;',
        );
        await this.dataSource.query(
            'TRUNCATE TABLE "post_reaction" RESTART IDENTITY CASCADE;',
        );
        await this.dataSource.query(
            'TRUNCATE TABLE "comment_reaction" RESTART IDENTITY CASCADE;',
        );

        return {
            status: 'succeeded',
        };
    }
}
