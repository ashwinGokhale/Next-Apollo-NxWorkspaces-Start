import React from 'react';
import Link from 'next/link';
import { Menu } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import * as styles from './Navbar.less';

export const NavMenu = (
    <Menu className={styles.menu} selectedKeys={[]}>
        <Menu.Item key="userCenter">
            <Link href="/profile">
                <a>Profile</a>
            </Link>
        </Menu.Item>

        <Menu.Divider />
        <Menu.Item key="logout">
            <span>
                <LogoutOutlined style={{ marginRight: '5px' }} />
                <Link href="/logout">
                    <a
                        style={{
                            textDecoration: 'none',
                            color: 'rgba(0, 0, 0, .65)'
                        }}
                    >
                        Logout
                    </a>
                </Link>
            </span>
        </Menu.Item>
    </Menu>
);
