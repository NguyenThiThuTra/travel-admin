import { Empty } from 'antd';
import React from 'react';
import { OrderItem } from './OrderItem/OrderItem';

export function ListOrders({ orderStatus, data, seller = false }) {
  return (
    <div>
      {data?.map((item) => (
        <OrderItem
          orderStatus={orderStatus}
          seller={seller}
          data={item}
          key={item._id}
        />
      ))}
      {data?.length === 0 && <Empty />}
    </div>
  );
}
