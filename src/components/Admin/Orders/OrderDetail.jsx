import { Card, Descriptions, Tag } from 'antd';
import { ListOrders } from 'components/History/ListOrders/ListOrders';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from 'constants/order';
import {
  getOrder,
  useOrderDetailSelector,
  useUpdateOrderStatusSelector
} from 'features/Order/OrderSlice';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export default function OrderDetail() {
  let { id } = useParams();
  const orderDetail = useSelector(useOrderDetailSelector);
  const updateOrderStatus = useSelector(useUpdateOrderStatusSelector);
  const data = orderDetail?.data;
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getOrder(id));
    }
  }, [id, updateOrderStatus]);
  const totalPayment = (data) => {
    return data?.order?.reduce((acc, item) => {
      return acc + item?.select_room * item?.category_id?.price;
    }, 0);
  };
  return (
    <div>
      {orderDetail && (
        <div>
          <Card>
            <Descriptions title="Thông tin người đặt">
              <Descriptions.Item label="Tên">{data?.name}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">
                {data?.phone_number}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {moment(data?.start).format('DD/MM/YYYY')}-
                {moment(data?.end).format('DD/MM/YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Thanh toán">
                {data?.payment}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  style={{ borderRadius: '10px' }}
                  color={ORDER_STATUS_COLOR?.[data?.status]}
                >
                  {ORDER_STATUS?.[data?.status].vi}
                </Tag>
              </Descriptions.Item>

              {/* {data?.note && ( */}
              {data?.note && (
                <Descriptions.Item span={3} label="Note">
                  {data?.note}
                </Descriptions.Item>
              )}
              {/* )} */}
            </Descriptions>
          </Card>
          <ListOrders seller data={[data]} />
        </div>
      )}
    </div>
  );
}
