import React from 'react';
import Link from 'next/link';
import { Input, Button, Form, Checkbox } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { LoginInput } from '@app/data-access';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './LoginForm.less';

interface IProps {
    form: FormInstance;
    onSubmit: (input: LoginInput) => Promise<void>;
}

export const LoginForm = ({ form, onSubmit }: IProps) => {
    return (
        <Form
            form={form}
            name="normal_login"
            className="login-form"
            initialValues={{ rememberMe: true }}
            onFinish={onSubmit}
        >
            <Form.Item
                name="email"
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
                <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Email"
                />
            </Form.Item>
            <Form.Item
                name="password"
                rules={[
                    { required: true, message: 'Please input your Password!' }
                ]}
            >
                <Input
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item>
                <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                    <Checkbox defaultChecked>Remember me</Checkbox>
                </Form.Item>

                <Link href="/forgot">
                    <a className="login-form-forgot">Forgot password</a>
                </Link>
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                >
                    Log in
                </Button>
                <br />
                Or{' '}
                <Link href="/signup">
                    <a>register now!</a>
                </Link>
            </Form.Item>
        </Form>
    );
};
