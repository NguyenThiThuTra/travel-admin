import { AppstoreOutlined } from '@ant-design/icons';
import { Divider, Menu, Switch } from 'antd';
import { PERMISSIONS } from 'constants/permissions';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
const { SubMenu } = Menu;

export function AdminMenu() {
  const [mode, setMode] = React.useState('inline');
  const [theme, setTheme] = React.useState('light');

  const changeMode = (value) => {
    setMode(value ? 'vertical' : 'inline');
  };

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };
  let match = useRouteMatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.currentUser);
  return (
    <Fragment>
      {/* <div style={{ padding: '1rem' }}>
        <Switch onChange={changeMode} /> Thay đổi chế dộ
      </div> */}
      <Divider type="vertical" />
      <div
        style={{
          padding: '0 1rem',
          position: 'relative',
          top: '-1rem',
          marginBottom: '1rem',
        }}
      >
        <Switch onChange={changeTheme} /> Thay đổi phong cách
      </div>

      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={['homestays']}
        defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
      >
        <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Danh mục">
          <Menu.Item key="homestays">
            <Link to={`${match.path}/homestays`}>Homestays </Link>
          </Menu.Item>
          <Fragment>
            <Menu.Item key="users">
              <Link to={`${match.path}/users`}>Users </Link>
            </Menu.Item>
          </Fragment>

          {/* <Menu.Item key="rooms">
            <Link to={`${match.path}/rooms`}>Rooms </Link>
          </Menu.Item> */}
          <Menu.Item key="orders">
            <Link to={`${match.path}/orders`}>Booking </Link>
          </Menu.Item>
          <Menu.Item key="category">
            <Link to={`${match.path}/category`}>Rooms </Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Fragment>
  );
}
