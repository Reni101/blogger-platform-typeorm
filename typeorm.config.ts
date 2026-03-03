import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
    url: process.env.PG_URL,
    type: 'postgres',
    migrations: ['migrations/*.ts'],
    entities: ['src/**/*.entity.ts'],
});
// to generate migrations  migration:generate ./migrations/Name
