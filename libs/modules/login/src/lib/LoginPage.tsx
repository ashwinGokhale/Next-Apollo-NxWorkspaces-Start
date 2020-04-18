import React from 'react';
import Head from 'next/head';
import { Form, message } from 'antd';
import {
    useLoginMutation,
    useSetAuthMutation,
    LoginInput
} from '@app/data-access';
import { err } from '@app/modules/common';
import Router from 'next/router';
import { LoginForm } from './LoginForm';

const key = 'login-page-msg';

export const LoginPage = () => {
    const [form] = Form.useForm();

    const [login] = useLoginMutation();
    const [setAuth] = useSetAuthMutation();

    const onSubmit = async (input: LoginInput) => {
        try {
            message.destroy();
            message.loading({
                content: 'Loading...',
                key,
                duration: 0
            });
            const res = await login({ variables: { input } });

            await setAuth({
                variables: { input: res.data.login }
            });

            Router.push('/');
            message.success({ content: 'Successfully logged in', key });
        } catch (error) {
            message.error({ content: err(error), key });
        }
    };

    return (
        <div
            className="section"
            style={{ backgroundColor: 'white', height: '100%' }}
        >
            <Head>
                <title>Login</title>
            </Head>
            <div className="section-container">
                <h3 className="title">Login</h3>
                <div
                    className="panel panel-default"
                    style={{ paddingLeft: '30px' }}
                >
                    <LoginForm form={form} onSubmit={onSubmit} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
