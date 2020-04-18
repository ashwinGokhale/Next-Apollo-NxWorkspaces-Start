import { ApolloClient } from 'apollo-client';
import { NextPageContext } from 'next';

export interface IContext extends NextPageContext {
    apolloClient: ApolloClient<any>;
}
