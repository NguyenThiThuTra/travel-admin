import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { AdminMenu } from 'components/Admin/AdminMenu';
import ActionFormDestination from 'components/Admin/Destinations/ActionFormDestination';
import DestinationsPage from 'components/Admin/Destinations/Destinations';
import ActionFormHomestay from 'components/Admin/Homestays/ActionFormHomestay';
import HomestaysPage from 'components/Admin/Homestays/Homestays';
import ActionFormRoom from 'components/Admin/Rooms/ActionFormRoom';
import RoomsPage from 'components/Admin/Rooms/Rooms';
import ActionFormUser from 'components/Admin/Users/ActionFormUser';
import UsersPage from 'components/Admin/Users/Users';
import OrdersPage from 'components/Admin/Orders/Orders';
import OrderDetail from 'components/Admin/Orders/OrderDetail';
import { PrivateRoute } from 'common/PrivateRoute';
import AdminCategoryPage from 'components/Admin/Category/Category';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { useSelector } from 'react-redux';
export const MENU_ADMIN_ROUTES = [
  { id: 1, element: <UsersPage />, path: 'users' },
  { id: 2, element: <ActionFormUser />, path: 'users/:action' },
  { id: 3, element: <ActionFormUser />, path: 'users/:action/:id' },
  { id: 4, element: <HomestaysPage />, path: 'homestays' },
  { id: 4, element: <ActionFormHomestay />, path: 'homestays/:action' },
  { id: 5, element: <ActionFormHomestay />, path: 'homestays/:action/:id' },
  { id: 6, element: <DestinationsPage />, path: 'destinations' },
  { id: 7, element: <ActionFormDestination />, path: 'destinations/:action' },
  {
    id: 8,
    element: <ActionFormDestination />,
    path: 'destinations/:action/:id',
  },
  { id: 9, element: <RoomsPage />, path: 'rooms' },
  { id: 10, element: <ActionFormRoom />, path: 'rooms/:action' },
  {
    id: 11,
    element: <ActionFormRoom />,
    path: 'rooms/:action/:id',
  },
  // orders
  { id: 12, element: <OrdersPage />, path: 'orders' },
  { id: 13, element: <OrderDetail />, path: 'orders/:id' },
  // category
  { id: 17, element: <AdminCategoryPage />, path: 'category' },
];
export default function AdminPage() {
  let match = useRouteMatch();

  return (
    <div style={{ paddingTop: '8rem' }}>
      <Row>
        <Col>
          <AdminMenu />
        </Col>
        <Col flex="auto" style={{ position: 'relative' }}>
          <div
            style={{ padding: '1.5rem', position: 'absolute', width: '100%' }}
          >
            <Switch>
              {MENU_ADMIN_ROUTES?.map((route) => (
                <PrivateRoute
                  key={route.id}
                  exact
                  path={`${match.path}/${route.path}`}
                >
                  {route.element}
                </PrivateRoute>
              ))}
            </Switch>
          </div>
        </Col>
      </Row>
    </div>
  );
}
