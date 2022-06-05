import React from 'react';

export function useAuth() {
  const [currentUser, setCurrentUser] = React.useState(
    JSON.parse(localStorage.getItem('currentUser'))
  );
  const changeCurrentUser = (user) => {
    setCurrentUser(localStorage.setItem('currentUser', JSON.stringify(user)));
  };

  return { currentUser, changeCurrentUser };
}
