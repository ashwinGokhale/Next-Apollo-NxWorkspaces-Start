import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { message } from 'antd';
import { err } from '@app/modules/common';
import { SignupInput, useSignupMutation } from '@app/data-access';
import { SignupForm } from './SignupForm';

import './SignupPage.less';



const key = 'signup-page-msg';

export const SignupPage = () => {
    const [form] = Form.useForm();
    const [signup] = useSignupMutation();

    const onSubmit = async (input: SignupInput) => {
        try {
            message.destroy();
            message.loading({
                content: 'Loading...',
                key,
                duration: 0
            });
            await signup({ variables: { input } });

            Router.push('/login');
            message.success({ content: 'Successfully signed up!', key });
        } catch (error) {
            message.error({ content: err(error), key });
        }
    };
    return (
        <div
            className="section"
            style={{ backgroundColor: 'white', height: '100%' }}
        >
            <div className="section-container">
                <Head>
                    <title>Signup</title>
                </Head>
                <h3 className="title">Sign Up</h3>
                <SignupForm form={form} onSubmit={onSubmit} />
            </div>
        </div>
    );
};

export default SignupPage;
