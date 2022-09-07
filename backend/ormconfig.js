const { config } = require('dotenv');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    config({
        path: path.resolve(process.cwd(), '.env.local'),
        override: true,
    });
}

module.exports = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    subscribers: [isProduction ? 'dist/subscribers/*.js' : 'src/subscribers/*.ts'],
    migrations: [isProduction ? 'dist/migration/*.js' : 'src/migration/*.ts'],
    entities: [isProduction ? 'dist/entity/*.js' : 'src/entity/*.ts'],
    cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscribers',
    },
    synchronize: true,
};
