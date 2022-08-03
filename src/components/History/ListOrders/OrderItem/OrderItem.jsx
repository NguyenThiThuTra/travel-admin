import {
  Button,
  Card,
  Divider,
  Popconfirm,
  Space,
  Tag,
  Typography,
} from 'antd';
import commentApi from 'api/comment';
import orderApi from 'api/orderApi';
import FormAssessmentHomestay from 'components/Homestay/FormAssessmentHomestay/FormAssessmentHomestay';
import { ORDER_STATUS, ORDER_STATUS_COLOR } from 'constants/order';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { updateOrder } from 'features/Order/OrderSlice';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import './OrderItem.css';

const { Title } = Typography;

const TYPE_ROOM = {
  single: 'Phòng đơn',
  double: 'Phòng đôi',
  family: 'Phòng gia đình',
  bigFamily: 'Phòng gia đình lớn',
};
export function OrderItem({ orderStatus, seller, data, totalPriceOrders }) {
  const dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);

  const handleChangeStatus = async (status) => {
    // update status !rejected
    if (status === ORDER_STATUS.approved.en) {
      const formOrder = { status };
      return dispatch(
        updateOrder({
          id: data._id,
          order: formOrder,
        })
      );
    }
    if (
      status === ORDER_STATUS.rejected.en ||
      status === ORDER_STATUS.canceled.en
    ) {
      // update status rejected
      const formOrder = { status };
      return dispatch(
        updateOrder({
          id: data._id,
          order: formOrder,
        })
      );
    }
  };
  // total payment
  const totalPayment = useMemo(
    () =>
      data?.total_payment ||
      data?.order?.reduce((acc, item) => {
        return acc + item?.select_room * item?.category_id?.price;
      }, 0),
    [data]
  );

  // show Modal review
  const [loading, setLoading] = useState(false);
  const [visibleFormReview, setVisibleFormReview] = useState(false);

  const showModal = () => {
    setVisibleFormReview(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisibleFormReview(false);
    }, 3000);
  };

  const handleCancel = () => {
    setVisibleFormReview(false);
  };

  // handle assessments
  const [comments, setComments] = useState(null);
  const [orders, setOrders] = useState(null);

  // get all comments Homestay
  useEffect(() => {
    const getComments = async () => {
      const payload = { homestay_id: data?.homestay_id?._id };
      const response = await commentApi.getAllCommentInHomestay(payload);
      setComments(response?.data);
    };
    getComments();
  }, [data]);
  // get my order in homestay
  useEffect(() => {
    const getOrders = async () => {
      const payload = {
        filters: {
          homestay_id: data?.homestay_id?._id,
          user_id: currentUser?.data?._id,
          status: ORDER_STATUS.approved.en,
        },
      };
      const response = await orderApi.getAll(payload);
      setOrders(response?.data);
    };
    getOrders();
  }, [currentUser, data?.homestay_id?._id]);

  const checkOwnerHomestay = () => {
    if (
      currentUser?.data?._id &&
      currentUser?.data?._id === data?.homestay_id?.user_id
    ) {
      return true;
    }
    return false;
  };
  const checkUserCommented = () => {
    if (!checkOwnerHomestay()) {
      return true;
    }
    const limitComment = orders?.filter(
      (o) => o.status === ORDER_STATUS.approved.en
    )?.length;
    const commentsLength = comments?.data?.filter(
      (comment) => comment?.user_id?._id === currentUser?.data?._id
    ).length;
    if (limitComment && commentsLength) {
      return commentsLength < limitComment;
    }
  };

  return (
    <Fragment>
      <Card className="order-item">
        <Title level={4}>{data?.homestay_id?.name}</Title>
        <Divider className="order-item__divider" />
        {data?.order?.map(({ category_id: category, select_room }, idx) => (
          <div
            key={idx}
            style={{ marginBottom: '1rem' }}
            className="order-item__main"
          >
            <div className="order-item__description">
              <img
                className="order-item__img"
                src={
                  category?.images?.[0] ||
                  'https://chieutour.com.vn/upload/images/tour-du-lich-tu-tphcm-di-da-nang.jpg'
                }
                alt="img"
              />
              <div>
                <div className="order-item__name">{category?.name}</div>
                <div className="order-item__category">
                  {TYPE_ROOM[category?.type]}
                </div>
                <div className="order-item__quantity">{`x${select_room}`}</div>{' '}
              </div>
            </div>

            <div className="order-item__price">₫{category?.price}</div>
          </div>
        ))}

        <Divider className="order-item__divider" />
        <div className="order-item__bottom-wrap">
          <div>
            {
              // checkUserCommented() &&
              !seller && orderStatus === ORDER_STATUS.approved.en && (
                <div onClick={showModal} className="order-item__review">
                  <AiFillStar size={25} color="#fadb14" />
                  <span>Cho điểm và đánh giá </span>
                </div>
              )
            }
          </div>
          <div className="order-item__bottom">
            <div className="order-item__total">
              Tổng số tiền: <span>₫{totalPayment}</span>
            </div>
            {seller && data?.status === ORDER_STATUS.pending.en && (
              <Space>
                <Popconfirm
                  title="Bạn có chắc chắn muốn xác nhận đơn hàng này?"
                  onConfirm={() => handleChangeStatus(ORDER_STATUS.approved.en)}
                  okText="Đồng ý"
                  cancelText="Không"
                >
                  <Button type="primary">Xác nhận</Button>
                </Popconfirm>
                <Popconfirm
                  title="Bạn có chắc chắn muốn từ chối đơn hàng này?"
                  onConfirm={() => handleChangeStatus(ORDER_STATUS.rejected.en)}
                  okText="Đồng ý"
                  cancelText="Không"
                >
                  <Button type="danger">Từ chối</Button>
                </Popconfirm>
              </Space>
            )}
            {!seller && data?.status === ORDER_STATUS.pending.en && (
              <Popconfirm
                title="Bạn có chắc chắn muốn huỷ đơn hàng này?"
                onConfirm={() => handleChangeStatus(ORDER_STATUS.canceled.en)}
                okText="Đồng ý"
                cancelText="Không"
              >
                <div className="order-item__btn">Huỷ đơn hàng</div>
              </Popconfirm>
            )}
            {!seller && data?.status !== ORDER_STATUS.pending.en && (
              <Tag
                style={{ cursor: 'default', borderRadius: '20px' }}
                className="order-item__btn"
                color={ORDER_STATUS_COLOR?.[data?.status]}
              >
                {ORDER_STATUS?.[data?.status].vi}
              </Tag>
            )}
          </div>
        </div>
      </Card>

      {visibleFormReview && (
        <FormAssessmentHomestay
          homestay={data?.homestay_id}
          visible={visibleFormReview}
          loading={loading}
          handleOk={handleOk}
          handleCancel={handleCancel}
        />
      )}
    </Fragment>
  );
}
