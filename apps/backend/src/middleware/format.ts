import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { ArgumentValidationError } from 'type-graphql';
import { config } from '../config';
import { AuthenticationError } from 'apollo-server-express';

type format = (
    error: GraphQLError
) => GraphQLFormattedError<Record<string, any>>;

export const formatError: format = (err) => {
    if (config.NODE_ENV === 'production') delete err.stack;
    delete err.extensions.exception;
    if (err.originalError instanceof ArgumentValidationError) {
        const errors = err.originalError.validationErrors.flatMap((e) =>
            Object.values(e.constraints)
        );
        err.extensions.code = 400;
        err.extensions.errors = errors;
        err.message = errors[0];
    } else if (err.originalError instanceof AuthenticationError) {
        err.extensions.code = 401;
        err.extensions.errors = ['Insufficient permissions'];
    }
    return err;
};
