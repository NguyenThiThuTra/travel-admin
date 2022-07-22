import { AppstoreOutlined } from '@ant-design/icons';
import { Divider, Menu, Switch } from 'antd';
import { PERMISSIONS } from 'constants/permissions';
import React, { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
const { SubMenu } = Menu;

export function AdminMenu() {
  const location = useLocation();
  const [mode, setMode] = React.useState('inline');

  let match = useRouteMatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const ListMenuCategory = useMemo(() => {
    return [
      {
        path: 'homestays',
        name: 'Homestays',
      },
      {
        path: 'users',
        name: 'Users',
      },
      {
        path: 'orders',
        name: 'Booking',
      },
      {
        path: 'category',
        name: 'Rooms',
      },
    ];
  }, []);

  const defaultSelectedKeys = useMemo(() => {
    return ListMenuCategory?.find((item) =>
      location.pathname.includes(item.path)
    );
  }, [ListMenuCategory]);

  return (
    <Fragment>
      <Divider type="vertical" />

      <Menu
        style={{ width: 256 }}
        defaultSelectedKeys={[defaultSelectedKeys?.path || 'orders']}
        defaultOpenKeys={['sub1']}
        mode={mode}
      >
        <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Danh mục">
          {ListMenuCategory.map((item) => {
            return (
              <Menu.Item key={item.path}>
                <Link to={`${match.url}/${item.path}`}>{item.name}</Link>
              </Menu.Item>
            );
          })}
        </SubMenu>
      </Menu>
    </Fragment>
  );
}
