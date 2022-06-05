import { PrivateRoute } from 'common/PrivateRoute';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { appRoutes } from './routes';

export default function AppRoutes() {
  return (
    <Switch>
      {appRoutes.ADMIN_ROUTES.map((route) => (
        <PrivateRoute key={route.id} path={route.path}>
          {route.component}
        </PrivateRoute>
      ))}
      {appRoutes.PRIVATE_ROUTES.map((route) => (
        <PrivateRoute key={route.id} path={route.path}>
          {route.component}
        </PrivateRoute>
      ))}
      {appRoutes.PUBLIC_ROUTES.map((route) => (
        <Route key={route.id} path={route.path}>
          {route.component}
        </Route>
      ))}
    </Switch>
  );
}
