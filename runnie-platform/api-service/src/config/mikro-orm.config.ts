import { Migrator } from '@mikro-orm/migrations';
import { MySqlDriver } from '@mikro-orm/mysql';
import * as dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dbName: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) ?? 3306,
    host: process.env.DB_HOST,
    driver: MySqlDriver,
    migrations: {
        path: './dist/database/migrations',
        pathTs: './src/database/migrations',
        tableName: 'migrations'
    },
    extensions: [Migrator],
    debug: false,
}

export default dbConfig;