import { ApolloError } from 'apollo-server-express';

export const BadRequestError = (message: string) =>
    new ApolloError(message, 400 as unknown as string);
