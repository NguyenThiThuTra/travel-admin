import { AppstoreOutlined } from '@ant-design/icons';
import { Divider, Menu, Switch } from 'antd';
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
        {/* <Menu.Item key="1" icon={<MailOutlined />}>
          Option1
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />}>
          Navigation Two
        </Menu.Item> */}
        <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Danh mục">
          <Menu.Item key="homestays">
            <Link to={`${match.path}/homestays`}>Homestays </Link>
          </Menu.Item>
          {currentUser?.data?.roles === 'admin' && (
            <Fragment>
              <Menu.Item key="users">
                <Link to={`${match.path}/users`}>Users </Link>
              </Menu.Item>
              <Menu.Item key="destinations">
                <Link to={`${match.path}/destinations`}>Destinations </Link>
              </Menu.Item>
            </Fragment>
          )}

          <Menu.Item key="rooms">
            <Link to={`${match.path}/rooms`}>Rooms </Link>
          </Menu.Item>
          <Menu.Item key="orders">
            <Link to={`${match.path}/orders`}>Orders </Link>
          </Menu.Item>
          <Menu.Item key="category">
            <Link to={`${match.path}/category`}>Categorys </Link>
          </Menu.Item>
          {/* <Menu.Item key="7">
            <Link to={`${match.path}/favourite`}>Favourite </Link>
          </Menu.Item>
          <SubMenu key="sub1-2" title="OrderSchema">
            <Menu.Item key="8">Option 5</Menu.Item>
            <Menu.Item key="9">Option 6</Menu.Item>
          </SubMenu> */}
        </SubMenu>
        {/* <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
          <Menu.Item key="10">Option 7</Menu.Item>
          <Menu.Item key="11">Option 8</Menu.Item>
          <Menu.Item key="12">Option 9</Menu.Item>
          <Menu.Item key="13">Option 10</Menu.Item>
        </SubMenu> */}
      </Menu>
    </Fragment>
  );
}
