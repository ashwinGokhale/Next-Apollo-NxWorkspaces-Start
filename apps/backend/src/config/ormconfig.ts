import { Post } from '../models/Post';
import { User } from '../models/User';
import { Comment } from '../models/Comment';

import config = require('./config');

const commonConfig = {
    synchronize: true,
    logging: false,
    entities: [User, Post, Comment],
    migrations: [],
    subscribers: [],
    cli: {
        entitiesDir: `apps/backend/src/models`,
        migrationsDir: `apps/backend/src/migrations`,
        subscribersDir: `apps/backend/src/subscribers`
    }
};

const defaultConfig = {
    ...commonConfig,
    name: 'default',
    url: config.DATABASE_URL,
    type: config.TYPEORM_CONNECTION
};

const test = {
    ...commonConfig,
    dropSchema: true,
    synchronize: true,
    name: 'default',
    type: 'sqlite',
    database: ':memory:'
};

module.exports = config.NODE_ENV === 'test' ? test : defaultConfig;
