import NotFount from 'common/NotFount/NotFount';
import Admin from 'pages/Admin/AdminPage';
import HomePage from 'pages/Home/HomePage';
import LoginPage from 'pages/Login/LoginPage';

export const appRoutes = {
  ADMIN_ROUTES: [{ id: 9999, path: '/admin', component: <Admin /> }],
  PRIVATE_ROUTES: [
    {
      id: 0,
      path: '/my-homestay',
      component: <Admin />,
    },
  ],
  PUBLIC_ROUTES: [
    {
      id: 9,
      path: '/login',
      component: <LoginPage />,
    },
    
    { id: 1, path: '/', component: <HomePage /> },
    { id: 0, path: '*', component: <NotFount /> },
  ],
};
