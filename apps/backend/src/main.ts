import 'reflect-metadata';

import { Server } from './server';

export const start = async () => {
    try {
        const server = await Server.createInstance();
        await server.start();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

start();
