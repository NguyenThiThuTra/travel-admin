import { ArrowUpOutlined } from '@ant-design/icons';
import { BackTop, Spin } from 'antd';
import Header from 'common/Header/Header';
import { HIDDEN_HEADER } from 'constants/pathnameSpecial';
import { useLoadingAppSelector } from 'features/commonSlice';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { flagPathname } from 'utils/flagPathname';

export default function AppLayout({ children }) {
  const location = useLocation();

  const loadingApp = useSelector(useLoadingAppSelector);
  // const currentUser = useSelector(useCurrentUserSelector);

  return (
    <React.StrictMode>
      <Spin spinning={loadingApp} tip="Loading...">
        <div className="App">
          {!flagPathname(HIDDEN_HEADER, location.pathname) && <Header />}

          {/* LIST_ROUTE    */}
          {children}
          {/*End LIST_ROUTE    */}

          {/* popup chat admin */}
          {/* {currentUser && <PopupChat />} */}

          <BackTop style={{ bottom: '100px' }}>
            <div
              style={{
                height: 40,
                width: 40,
                lineHeight: '40px',
                borderRadius: 4,
                backgroundColor: '#23232c',
                color: '#fff',
                textAlign: 'center',
                fontSize: 14,
              }}
            >
              <ArrowUpOutlined />
            </div>
          </BackTop>
        </div>
      </Spin>
    </React.StrictMode>
  );
}
