import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';

config();

const pgUrl = process.env.PG_URL ?? '';
const needsSsl =
    process.env.NODE_ENV === 'production' ||
    /sslmode=require|neon\.tech|supabase\.co/i.test(pgUrl);

export default new DataSource({
    url: process.env.PG_URL,
    type: 'postgres',
    synchronize: false,
    ssl: needsSsl ? { rejectUnauthorized: false } : false,
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    entities: [join(__dirname, 'src', '**', '*.entity.{ts,js}')],
});
// npm run migration:generate -- ./migrations/Init
