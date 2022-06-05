import NotFount from 'common/NotFount/NotFount';
import HomePage from 'pages/Home/HomePage';
import LoginPage from 'pages/Login/LoginPage';
import Admin from 'pages/Admin/AdminPage';
import OrdersPage from 'components/Admin/Orders/Orders';
import OrderDetail from 'components/Admin/Orders/OrderDetail';
import ActionFormRoom from 'components/Admin/Rooms/ActionFormRoom';
import AdminHomestaysPage from 'components/Admin/Homestays/Homestays';
import ActionFormHomestay from 'components/Admin/Homestays/ActionFormHomestay';
import UsersPage from 'components/Admin/Users/Users';
import ActionFormUser from 'components/Admin/Users/ActionFormUser';
import AdminCategoryPage from 'components/Admin/Category/Category';


export const RouteConstant = {
  NotFount: {
    path: '*',
    component: <NotFount />,
  },
  HomePage: {
    path: '/',
    component: <HomePage />,
  },
  LoginPage: {
    path: '/login',
    component: <LoginPage />,
  },
  MyHomestay: {
    path: '/my-homestay',
    component: <Admin />,
  },
  AdminPage: {
    path: '/admin',
    component: <Admin />,
  },
  AdminOrders: {
    path: '/admin/orders',
    component: <OrdersPage />,
  },
  AdminOrderDetail: {
    path: '/admin/orders/:id',
    component: <OrderDetail />,
  },
  AdminActionFormRoomDetail: {
    path: '/admin/rooms/:action/:id',
    component: <ActionFormRoom />,
  },
  AdminRoom: {
    path: '/admin/rooms',
  },
  AdminActionFormRoom: {
    path: '/admin/rooms/:action',
    component: <ActionFormRoom />,
  },
  AdminHomestay: {
    path: '/admin/homestays',
    component: <AdminHomestaysPage />,
  },
  AdminActionFormHomestay: {
    path: '/admin/homestays/:action',
    component: <ActionFormHomestay />,
  },
  AdminActionFormHomestayDetail: {
    path: '/admin/homestays/:action/:id',
    component: <ActionFormHomestay />,
  },
  AdminUser: {
    path: '/admin/users',
    component: <UsersPage />,
  },
  AdminActionFormUser: {
    path: '/admin/users/:action',
    component: <ActionFormUser />,
  },
  AdminActionFormUserDetail: {
    path: '/admin/users/:action/:id',
    component: <ActionFormUser />,
  },
  AdminCategoryPage: {
    path: '/admin/category',
    component: <AdminCategoryPage />,
  },
};
