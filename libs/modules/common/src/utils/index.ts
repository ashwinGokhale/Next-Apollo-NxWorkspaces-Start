import { ApolloError } from 'apollo-client';

export const isBrowser = () => typeof window !== 'undefined';

export const err = (e: Error | ApolloError) => {
    if (!e) return 'Whoops, something went wrong!';
    if (e instanceof ApolloError) {
        if (e.networkError) return 'Whoops, something went wrong!';
        return e.graphQLErrors.map((err) => err.message)[0];
    }

    return e.message || 'Whoops, something went wrong!';
};
