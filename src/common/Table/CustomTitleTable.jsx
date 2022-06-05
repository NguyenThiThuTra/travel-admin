import { Button } from 'antd';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { useHistory, useRouteMatch } from 'react-router-dom';
export default function CustomTitleTable({ hideAdd, title }) {
  let match = useRouteMatch();
  const history = useHistory();
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!hideAdd && (
        <Button
          onClick={() => history.push(`${match.path}/add`)}
          style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}
        >
          <AiOutlinePlus />
          Thêm mới
        </Button>
      )}

      <div>{title}</div>
    </div>
  );
}
