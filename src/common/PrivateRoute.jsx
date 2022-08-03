import { PERMISSIONS } from 'constants/permissions';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
export function PrivateRoute(props) {
  const { isAdmin } = props;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector(useCurrentUserSelector);

  const checkPermission = useMemo(() => {
    if (isAdmin && currentUser) {
      return currentUser.data.roles === PERMISSIONS.admin;
    }
    return isLoggedIn;
  }, [currentUser]);
  
  if (!checkPermission) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { from: props.location },
        }}
      />
    );
  }
  return <Route {...props} />;
}
