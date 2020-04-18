import React from 'react';
import { Form, Input, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { SignupInput } from '@app/data-access';

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

interface IProps {
    form: FormInstance;
    onSubmit: (input: SignupInput) => Promise<void>;
}

export const SignupForm = ({ form, onSubmit }: IProps) => {
    return (
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
                            if (value && getFieldValue('password') !== value) {
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
    );
};
