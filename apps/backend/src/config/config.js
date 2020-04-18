require('dotenv').config();

const env = process.env;

module.exports = {
    PORT: env.PORT || 5000,
    DATABASE_URL: env.DATABASE_URL
        ? env.DATABASE_URL
        : 'postgres://admin:admin@localhost:5432/app',
    TYPEORM_CONNECTION: env.TYPEORM_CONNECTION
        ? env.TYPEORM_CONNECTION
        : 'postgres',
    EXPIRES_IN: env.EXPIRES_IN || '7 days',
    NODE_ENV: env.NODE_ENV || 'development',
    SECRET: env.SECRET || 'my-secret',
    LOG_LEVEL: env.LOG_LEVEL || 'trace',
    APP_DEBUG: env.APP_DEBUG === 'true',
    REDIRECT_HTTPS: env.REDIRECT_HTTPS === 'true'
};
