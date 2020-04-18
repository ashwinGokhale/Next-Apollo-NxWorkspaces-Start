import { AppContext } from 'next/app';
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import withApollo from '../lib/withApollo';
import { isBrowser } from '@myapp/modules/common';
import { IContext } from '@myapp/data';
import {
    RefreshAuthDocument,
    RefreshAuthQuery,
    GetAuthQuery,
    GetAuthDocument,
    SetAuthMutation,
    SetAuthDocument
} from '@myapp/data-access';
import { Layout } from '@myapp/modules/common';

interface IProps extends AppContext {
    ctx: IContext;
}

const App = ({ Component, pageProps, apollo, user }) => (
    <ApolloProvider client={apollo}>
        <Layout user={user}>
            <Component {...pageProps} />
        </Layout>
    </ApolloProvider>
);

App.getInitialProps = async ({ Component, ctx }: IProps) => {
    if (!isBrowser()) {
        // Refresh token on every server rendered request
        try {
            const { data } = await ctx.apolloClient.query<RefreshAuthQuery>({
                query: RefreshAuthDocument,
                errorPolicy: 'all'
            });

            if (data?.refresh) {
                await ctx.apolloClient.mutate<SetAuthMutation>({
                    mutation: SetAuthDocument,
                    variables: { input: data.refresh }
                });
            }
            // eslint-disable-next-line no-empty
        } catch {}
    }

    const {
        authData: { user }
    } = ctx.apolloClient.readQuery<GetAuthQuery>({
        query: GetAuthDocument
    });

    return {
        user,
        pageProps: Component.getInitialProps
            ? await Component.getInitialProps(ctx)
            : {}
    };
};

export default withApollo(App as any);
