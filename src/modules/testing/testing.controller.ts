import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('test')
export class TestingController {
    constructor(@InjectDataSource() protected dataSource: DataSource) {}
    @Delete('all-data')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteAll() {
        await this.dataSource.query(`
            TRUNCATE TABLE
                "users",
                "sessions",
                "email_confirmation",
                "posts",
                "blogs",
                "comments",
                "post_reaction",
                "comment_reaction"
            RESTART IDENTITY CASCADE;
        `);

        return {
            status: 'succeeded',
        };
    }
}
