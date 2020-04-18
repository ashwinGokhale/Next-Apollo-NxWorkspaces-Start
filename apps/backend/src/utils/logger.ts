import * as pino from 'pino';
import { config } from '../config';
import Container from 'typedi';

const prettyOptions: pino.PrettyOptions = {
    levelFirst: true,
    translateTime: true,
};

export const createLogger = (context: string | object | Function) => {
    if (typeof context === 'object') context = context.constructor.name;
    if (typeof context === 'function') context = context.name;

    const pinoOptions: pino.LoggerOptions = {
        prettyPrint: config.NODE_ENV === 'development' ? prettyOptions : false,
        enabled: config.APP_DEBUG || config.NODE_ENV !== 'test',
        base: { name: context },
        timestamp:
            config.NODE_ENV === 'production'
                ? false
                : pino.stdTimeFunctions.epochTime,
        level: config.LOG_LEVEL,
    };

    const logger = pino(pinoOptions);
    return logger;
};

export const Logger = () => {
    return (
        object: object | Function,
        propertyName: string,
        index?: number
    ) => {
        const logger = createLogger(object);
        Container.registerHandler({
            object,
            propertyName,
            index,
            value: () => logger,
        });
    };
};
