import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

config();

const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource({
    url: process.env.PG_URL,
    type: 'postgres',
    synchronize: false,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    entities: [join(__dirname, 'src', '**', '*.entity.{ts,js}')],
});
// npm run migration:generate -- ./migrations/Init
