import React, { useState } from 'react';
import Head from 'next/head';
import { Form, Input, message, Button } from 'antd';
import { useLoginMutation, useSetAuthMutation } from '@app/data-access';
import { err } from '@app/modules/common';
import Router from 'next/router';

const key = 'login-page-msg';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [login] = useLoginMutation();
    const [setAuth] = useSetAuthMutation();

    const onSubmit = async () => {
        try {
            message.destroy();
            message.loading({
                content: 'Loading...',
                key,
                duration: 0
            });
            const res = await login({ variables: { email, password } });
            console.log('Login response:', res);

            const response = await setAuth({
                variables: { input: res.data.login }
            });
            console.log('Response:', response);

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
                    <Form className="panel-body">
                        <Input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '200px', marginRight: '15px' }}
                        />
                        <br />
                        <br />
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '200px' }}
                        />
                        <br />
                        <br />
                        <Button onClick={onSubmit}>Sign In</Button>
                        <br />
                        <br />
                        <input
                            type="checkbox"
                            name="remember"
                            // onClick={onClick}
                        />{' '}
                        Remember Me
                        <br />
                        <br />
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
