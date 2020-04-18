import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import getConfig from 'next/config';
import { isBrowser } from '@app/modules/common';
import { getDataFromTree } from '@apollo/react-ssr';
import { GetAuthDocument } from '@app/data-access';
import { parseCookies, destroyCookie, setCookie } from 'nookies';
import gql from 'graphql-tag';

export default withApollo(
    ({ initialState, ctx }) => {
        if (!initialState) {
            initialState = {
                authData: {
                    user: null,
                    token: '',
                    __typename: 'AuthOutput'
                }
            };
        }

        const cache = new InMemoryCache().restore(initialState);
        cache.writeQuery({
            query: GetAuthDocument,
            data: {
                authData: initialState.authData
            }
        });

        const client = new ApolloClient({
            ssrMode: !isBrowser(),
            link: ApolloLink.from([
                onError(({ networkError, forward, operation }) => {
                    if (networkError) {
                        console.error('Got network error:', networkError);
                    }
                    forward(operation);
                }),
                setContext((_, { headers }) => {
                    // get the authentication token from local storage if it exists
                    const { token } = parseCookies(ctx);
                    // return the headers to the context so httpLink can read them
                    return {
                        headers: {
                            ...headers,
                            authorization: token ? `Bearer ${token}` : ''
                        }
                    };
                }),
                createHttpLink({
                    uri: `${
                        getConfig().publicRuntimeConfig.BACKEND_URL
                    }/graphql`,
                    useGETForQueries: true
                })
            ]),
            connectToDevTools:
                getConfig().publicRuntimeConfig.NODE_ENV === 'development',
            cache,
            resolvers: {
                Mutation: {
                    setAuth: (root, { input }, ctx) => {
                        const client: ApolloClient<{}> = ctx.cache;

                        const data = {
                            authData: { ...input, __typename: 'AuthOutput' }
                        };

                        client.writeQuery({
                            query: GetAuthDocument,
                            data
                        });

                        if (!input || !input.token) destroyCookie(ctx, 'token');
                        else setCookie(ctx, 'token', input.token, {});
                        return input;
                    }
                },
                Query: {
                    authData: (root, args, ctx) => {
                        const cache: InMemoryCache = ctx.cache;

                        console.log('Getting auth data');
                        return null;
                    }
                }
            },
            typeDefs: gql`
                extend type Query {
                    authData: AuthOutput @client
                }
            `
        });

        return client;
    },
    { getDataFromTree }
);
