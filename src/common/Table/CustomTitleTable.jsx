import { Button } from 'antd';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoChevronBackCircle } from 'react-icons/io5';
import { useHistory, useRouteMatch } from 'react-router-dom';
export default function CustomTitleTable({
  hideAdd,
  title,
  showButtonBack = false,
}) {
  let match = useRouteMatch();
  const history = useHistory();
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {showButtonBack && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            onClick={() => history.goBack()}
            type="primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '20px',
            }}
          >
            <IoChevronBackCircle
              style={{ cursor: 'pointer', marginRight: '5px' }}
              fontSize={20}
            />
            Quay lại
          </Button>
        </div>
      )}
      {!hideAdd && (
        <Button
          onClick={() => history.push(`${match.url}/add`)}
          style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}
          type="primary"
        >
          <AiOutlinePlus />
          Thêm mới
        </Button>
      )}

      <div>{title}</div>
    </div>
  );
}
