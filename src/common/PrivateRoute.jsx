import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
export function PrivateRoute(props) {
  const { isAdmin } = props;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const currentUser = useSelector(useCurrentUserSelector);
  console.log({ isLoggedIn, currentUser });
  const checkPermission = useMemo(() => {
    if (isAdmin && currentUser) {
      return currentUser.data.roles === 'admin';
    }
    return isLoggedIn;
  }, [currentUser]);
  console.log({ checkPermission });
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
