import { Col, Dropdown, Menu, message, Row, Tooltip } from 'antd';
import { HEADER } from 'constants/header';
import { LOGO } from 'constants/logo';
import { HEADER_BACKGROUND_DARK } from 'constants/pathnameSpecial';
import { useDetectScroll } from 'hooks/useDetectScroll';
import React, { useEffect, useState } from 'react';
import { HiOutlineMenu } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { flagPathname } from 'utils/flagPathname';
import NavbarItem from '../NavbarItem/NavbarItem';
import { authActions, getCurrentUser } from '../../features/Auth/AuthSlice';
import ModalLogin from './ModalLogin/ModalLogin';
import UserProfile from './UserProfile/UserProfile';
import { resetAction } from 'app/store';
import {
  toggleModalLogin,
  useVisibleModalLoginSelector,
} from 'features/commonSlice';

const Header = () => {
  let location = useLocation();
  let history = useHistory();
  let dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [isLoggedIn]);
  const loading = useSelector((state) => state.auth.loading);
  const [isActive, setIsActive] = useState(1);
  //show info
  const [visibleUserProfile, setVisibleUserProfile] = useState(false);
  const showUserProfile = () => {
    setVisibleUserProfile(true);
  };
  const onCloseUserProfile = () => {
    setVisibleUserProfile(false);
  };
  const handleClickIcon = (id) => {
    if (id === 2) {
      showUserProfile();
    }
    if (id === 4) {
      history.push('/cart');
    }
  };

  //end show info
  //modal login
  const visibleModalLogin = useSelector(useVisibleModalLoginSelector);
  const handleToggleModalLogin = () => {
    dispatch(toggleModalLogin());
  };

  const handleLogout = async () => {
    try {
      dispatch(resetAction());
      dispatch(authActions.logout());
      history.push('/');
    } catch (e) {
      console.error(e);
    }
  };
  const menu = isLoggedIn ? (
    <Menu>
      <Menu.Item onClick={showUserProfile}>
        <div>Thông tin cá nhân</div>
      </Menu.Item>
      {currentUser?.data?.roles === 'user' && (
        <React.Fragment>
          <Menu.Item onClick={() => history.push('/history')}>
            <div>Lịch sử đặt phòng</div>
          </Menu.Item>
          <Menu.Item onClick={() => history.push('/my-homestay/homestays')}>
            <div>Homestay của tôi</div>
          </Menu.Item>
        </React.Fragment>
      )}
      {/* {currentUser?.data?.roles === 'admin' && (
        <Menu.Item onClick={() => history.push('/admin/homestays')}>
          <div>Admin</div>
        </Menu.Item>
      )} */}
      <Menu.Item onClick={handleLogout}>
        <div>Đăng xuất</div>
      </Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item onClick={handleToggleModalLogin}>
        <div>Đăng nhập / Đăng ký</div>
      </Menu.Item>
    </Menu>
  );
  //end modal
  //detect scroll
  const { scrollingUp, top, setTop } = useDetectScroll();
  //end detect scroll
  return (
    <div
      className={`header ${!scrollingUp ? 'none' : ''} ${!top ? 'top' : ''}`}
      style={{
        backgroundColor:
          flagPathname(HEADER_BACKGROUND_DARK, location.pathname) &&
          'rgb(11 47 78 / 85%)',
      }}
      onMouseEnter={() => setTop(false)}
      onMouseLeave={() => setTop(true)}
    >
      <Row style={{ flex: 1 }}>
        <Col xs={6} sm={6} md={6} lg={10} span={10}>
          <div className="toggle_menu">
            <HiOutlineMenu
              color={`${!top ? '#000' : '#fff'}`}
              fontSize="2rem"
            />
          </div>
          <div className="navbarMain">
            <ul className="navbar">
              {HEADER.ListItemNavbar.map((item) => (
                <div
                  key={item.id}
                  className="navbar__item"
                  onClick={() => item.id}
                >
                  <NavbarItem
                    isActive={location.pathname === item?.route && item.id}
                    item={item}
                  />
                </div>
              ))}
            </ul>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} span={4}>
          <div className="logo">
            {/* <img
              src={top ? LOGO.light : LOGO.dark}
              alt="logo"
              width={200}
              height={25}
            /> */}
          </div>
        </Col>
        <Col xs={6} sm={6} md={6} lg={10} span={10}>
          <ul className="navbar_icon">
            {HEADER.ListItemIcon.map((item) => (
              <li key={item.id} className="navbar_icon__item">
                {item.id !== 2 ? (
                  <Tooltip key={item.id} placement="bottom" title={item.text}>
                    <item.icon
                      onClick={() => handleClickIcon(item.id)}
                      fontSize="2rem"
                    />
                  </Tooltip>
                ) : (
                  <Dropdown overlay={menu} placement="bottomLeft" arrow>
                    <item.icon fontSize="2rem" />
                  </Dropdown>
                )}
              </li>
            ))}
            {visibleUserProfile && (
              <UserProfile
                loading={loading}
                onCloseUserProfile={onCloseUserProfile}
                visibleUserProfile={visibleUserProfile}
              />
            )}
            {visibleModalLogin && (
              <ModalLogin
                title="Title"
                visible={visibleModalLogin}
                hideModalLogin={handleToggleModalLogin}
              />
            )}
          </ul>
        </Col>
      </Row>
    </div>
  );
};

export default Header;
