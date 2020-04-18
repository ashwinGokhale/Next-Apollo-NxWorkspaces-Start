import React from 'react';
import Link from 'next/link';
import { Menu, Dropdown, Avatar, Layout } from 'antd';
import { IUser, IContext } from '@myapp/data';
import { GetAuthDocument, GetAuthQuery } from '@myapp/data-access';
import { NavMenu } from './NavMenu';
import * as styles from './Navbar.less';

interface IProps {
    user?: IUser;
}

const { Header } = Layout;

export const Navbar = ({ user }: IProps) => (
    <div>
        <Header
            style={{
                position: 'fixed',
                zIndex: 1,
                width: '100%',
                backgroundColor: 'white',
                display: 'flex',
                padding: '0px 24px'
            }}
        >
            <div className="logo">
                <img
                    alt="app logo"
                    src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/237/slice-of-pizza_1f355.png"
                    style={{ width: 40 }}
                />
            </div>

            {user ? (
                <Menu
                    theme="light"
                    mode="horizontal"
                    defaultSelectedKeys={['home']}
                    style={{ lineHeight: '64px', width: '100%' }}
                >
                    <Menu.Item key="home">
                        <Link href="/">
                            <a>Home</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="discover">
                        <Link href="/discover">
                            <a>Discover</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="post">
                        <Link href="/new-post">
                            <a>New Post</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="stats">
                        <Link href="/stats">
                            <a>Stats</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        className={styles.right}
                        style={{ float: 'right' }}
                    >
                        <Dropdown overlay={NavMenu}>
                            <div>
                                <span
                                    className={`${styles.action} ${styles.account}`}
                                />
                                <Avatar
                                    size="small"
                                    className={styles.avatar}
                                    src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                                    alt="avatar"
                                />
                                {user && (
                                    <span
                                        className={styles.name}
                                        style={{
                                            padding: '0px 10px',
                                            verticalAlign: 'middle'
                                        }}
                                    >
                                        {user.name}
                                    </span>
                                )}
                            </div>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
            ) : (
                <div>
                    <Menu
                        theme="light"
                        mode="horizontal"
                        defaultSelectedKeys={['home']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="home">
                            <Link href="/">
                                <a>Home</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="login">
                            <Link href="/login">
                                <a>Login</a>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="signup">
                            <Link href="/signup">
                                <a>Join</a>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </div>
            )}
        </Header>
    </div>
);
