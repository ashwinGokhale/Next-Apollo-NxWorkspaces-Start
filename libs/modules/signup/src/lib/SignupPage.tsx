import React from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Input, Button, Form, message } from 'antd';
import { useForm } from 'antd/lib/form/util';
import { err } from '@app/modules/common';
import { SignupInput, useSignupMutation } from '@app/data-access';

import './SignupPage.less';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    }
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 16,
            offset: 8
        }
    }
};

const key = 'signup-page-msg';

export const SignupPage = () => {
    const [form] = useForm();
    const [signup] = useSignupMutation();

    const onSubmit = async (input: SignupInput) => {
        try {
            message.destroy();
            message.loading({
                content: 'Loading...',
                key,
                duration: 0
            });
            const res = await signup({ variables: { input } });

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
                <Form
                    form={form}
                    {...formItemLayout}
                    onFinish={onSubmit}
                    style={{ marginLeft: '30px' }}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                pattern: /([a-zA-Z]+ )+[a-zA-Z]+/,
                                message: 'Please enter your first and last name'
                            },
                            {
                                required: true,
                                message: 'Please enter your first and last name'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid E-mail!'
                            },
                            {
                                required: true,
                                message: 'Please input your E-mail!'
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!'
                            }
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!'
                            },
                            ({ getFieldValue }) => ({
                                async validator(_, value) {
                                    if (
                                        value &&
                                        getFieldValue('password') !== value
                                    ) {
                                        throw new Error(
                                            'The two passwords that you entered do not match!'
                                        );
                                    }
                                }
                            })
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <br />
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            Join
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default SignupPage;
