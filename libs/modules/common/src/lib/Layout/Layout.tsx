import React from 'react';
import { Navbar } from '../Navbar/Navbar';
import './Layout.less';
import { Layout as AntLayout, message } from 'antd';
import { IUser } from '@app/data';

const { Content } = AntLayout;

interface IProps {
    children: React.ReactNode;
    user?: IUser;
}

message.config({ duration: 10 });

export const Layout = ({ children, user }: IProps) => {
    return (
        <div>
            <AntLayout className="layout">
                <Navbar user={user} />
                <Content
                    style={{
                        margin: '0px 24px',
                        marginTop: 84,
                        minHeight: '380px',
                        height: 'calc(100vh - 148px)'
                    }}
                >
                    {children}
                </Content>
            </AntLayout>
        </div>
    );
};
