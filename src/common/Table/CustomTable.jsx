import { Table } from 'antd';
import React from 'react';

export default function CustomTable(props) {
  const [options] = React.useState({
    bordered: true,
    pagination: { position: 'bottom' },
    size: 'small',
    showHeader: true,
    scroll: true,
    tableLayout: undefined,
    top: 'none',
    bottom: 'bottomRight',
  });

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <Table {...options} scroll={{ x: 1500 }} sticky {...props} />
    </div>
  );
}
