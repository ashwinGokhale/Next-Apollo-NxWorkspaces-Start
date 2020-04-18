import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { message } from 'antd';
import { useSetAuthMutation } from '@app/data-access';

/* eslint-disable-next-line */
export interface IProps {}

export const LogoutPage = () => {
    const [logout] = useSetAuthMutation();
    const router = useRouter();
    useEffect(() => {
        const func = async () => {
            message.destroy();

            await logout({
                variables: {
                    input: {
                        user: null,
                        token: '',
                        __typename: 'AuthOutput'
                    } as any
                }
            });

            router.push('/');

            message.success('Successfully logged out');
        };
        func().catch((err) => console.error('Error logging out:', err));
    }, []);

    return null;
};
