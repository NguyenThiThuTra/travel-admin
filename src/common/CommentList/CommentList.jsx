import {
  Avatar,
  Button,
  Comment,
  Empty,
  Form,
  Image,
  List,
  message,
  Tooltip,
  Typography,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { ORDER_STATUS } from 'constants/order';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  addCommentInHomestay,
  getAllCommentInHomestay,
  updateComment,
  useCommentPostSelector,
  useCommentsSelector,
  useCommentUpdateSelector,
  useLoadingCommentSelector,
} from 'features/Comment/CommentSlice';
import { useHomestaySelector } from 'features/Homestay/HomestaySlice';
import { getAllOrder, useOrderSelector } from 'features/Order/OrderSlice';
import useIsFirstRender from 'hooks/useIsFirstRender';
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const { Title } = Typography;

const Editor = ({ onSubmit, submitting, onChange, value }) => {
  return (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={onSubmit}
          type="primary"
        >
          Add Comment
        </Button>
      </Form.Item>
    </>
  );
};

export function CommentList() {
  let { id } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector(useCurrentUserSelector);
  const comments = useSelector(useCommentsSelector);
  const commentPost = useSelector(useCommentPostSelector);
  const commentUpdate = useSelector(useCommentUpdateSelector);
  const loading = useSelector(useLoadingCommentSelector);
  const order = useSelector(useOrderSelector);
  const homestay = useSelector(useHomestaySelector);

  const [paging, setPaging] = useState({ limit: 5, page: 1 });
  const [dataComments, setDataComments] = useState([]);
  const dummy = useRef();
  const loadMoreComments = () => {
    // dummy?.current?.scrollIntoView({ behavior: 'smooth' });
    setPaging((prevState) => ({ ...prevState, page: prevState.page + 1 }));
  };
  // get all comments Homestay

  const isFirstRender = useIsFirstRender();
  useEffect(() => {
    if (!id) {
      return;
    }
    const getComments = async () => {
      try {
        const response = await dispatch(
          getAllCommentInHomestay({
            homestay_id: id,
            params: { limit: paging.limit, page: paging.page },
          })
        ).unwrap();
        setDataComments((preState) => [...dataComments, ...response?.data]);
      } catch (error) {
        message.error(error.message);
        setDataComments(null);
      }
    };
    getComments();
  }, [id, commentPost, commentUpdate, paging]);

  // get my order in homestay
  useEffect(() => {
    if (currentUser?.data?._id && id) {
      dispatch(
        getAllOrder({
          filters: {
            homestay_id: id,
            user_id: currentUser?.data?._id,
            status: ORDER_STATUS.approved.en,
          },
        })
      );
    }
  }, [currentUser, id]);

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    const v = e.target.value;
    if (v !== value) {
      setValue(v);
    }
  };

  const handleSubmit = async () => {
    if (value) {
      try {
        dispatch(
          addCommentInHomestay({
            text: value,
            homestay_id: id,
            user_id: currentUser?.data?._id,
          })
        );
        setValue('');
      } catch (error) {
        message.error(error.message);
        console.error(error);
      }
    }
  };

  // handle replies comment
  const formRef = useRef(null);
  const [showReplyComment, setShowReplyComment] = useState(null);
  const [valueReplyComment, setValueReplyComment] = useState('');
  const handleShowInputReplyComment = (id) => {
    setShowReplyComment(id);
  };
  const handleChangeReplyComment = (e) => {
    const v = e.target.value;
    if (v !== valueReplyComment) {
      setValueReplyComment(v);
    }
  };
  const handleSubmitReplyComment = async (values) => {
    const { text } = values;
    if (text) {
      try {
        await dispatch(
          updateComment({
            id: showReplyComment,
            comment: { replies: [{ text }] },
          })
        ).unwrap();
        formRef?.current?.resetFields();
      } catch (error) {
        message.error(error.message);
        console.error(error);
      }
    }
  };

  const checkOwnerHomestay = () => {
    if (
      currentUser?.data?._id &&
      currentUser?.data?._id === homestay?.data?.user_id
    ) {
      return true;
    }
    return false;
  };
  const checkUserCommented = () => {
    if (checkOwnerHomestay()) {
      return true;
    }
    // const limitComment = order?.paging?.total;
    // const length = comments?.data?.filter(
    //   (comment) => comment?.user_id?._id === currentUser?.data?._id
    // ).length;

    // return length >= limitComment;x
    return true;
  };

  //
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(true);
  const [idImagePreview, setIdImageReview] = useState(null);
  const handleShowImagePreview = (id) => {
    setVisiblePreviewGroup(true);
    setIdImageReview(id);
  };
  const handleCloseImagePreview = () => {
    setVisiblePreviewGroup(false);
    setIdImageReview(null);
  };
  return (
    <Fragment>
      <div>
        <Title level={3}>Đánh giá từ người dùng</Title>
        {dataComments?.length > 0 ? (
          <Fragment>
            <List
              className="comment-list"
              header={`${dataComments.length} bình luận`}
              itemLayout="horizontal"
              dataSource={dataComments || []}
              renderItem={(item) => (
                <li key={Math.random()}>
                  <Comment
                    actions={
                      checkOwnerHomestay() && [
                        // !item?.replies?.length > 0 &&
                        <span
                          onClick={() => handleShowInputReplyComment(item._id)}
                          key="comment-list-reply-to-0"
                        >
                          Reply to
                        </span>,
                      ]
                    }
                    author={item.user_id?.name}
                    avatar={
                      item.user_id?.avatar ||
                      'https://joeschmoe.io/api/v1/random'
                    }
                    content={
                      <div>
                        {item.text}

                        {item?.images?.length > 0 && (
                          <Fragment>
                            <Image
                              style={{ marginTop: '2rem' }}
                              preview={{ visiblePreviewGroup: false }}
                              width={200}
                              src={item?.images[0]}
                              alt="image preview"
                              onClick={() => handleShowImagePreview(item?._id)}
                            />

                            <div style={{ display: 'none' }}>
                              <Image.PreviewGroup
                                preview={{
                                  visible:
                                    visiblePreviewGroup &&
                                    idImagePreview === item?._id,
                                  onVisibleChange: (vis) =>
                                    setVisiblePreviewGroup(vis),
                                }}
                              >
                                {item?.images?.map((image, index) => (
                                  <Image
                                    key={index}
                                    src={image}
                                    alt={`preview ${index}`}
                                  />
                                ))}
                              </Image.PreviewGroup>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    }
                    datetime={
                      <Tooltip
                        title={moment(item.updatedAt).format(
                          'YYYY-MM-DD HH:mm:ss'
                        )}
                      >
                        <span>{moment(item.updatedAt).fromNow()}</span>
                      </Tooltip>
                    }
                    children={
                      <>
                        {item?.replies?.map((reply) => (
                          <Comment
                            author={currentUser?.data?.name}
                            avatar={
                              currentUser?.data?.avatar ||
                              'https://joeschmoe.io/api/v1/random'
                            }
                            content={reply.text}
                            datetime={
                              <Tooltip
                                title={moment(reply.updatedAt).format(
                                  'YYYY-MM-DD HH:mm:ss'
                                )}
                              >
                                <span>{moment(reply.updatedAt).fromNow()}</span>
                              </Tooltip>
                            }
                          />
                        ))}
                        {checkOwnerHomestay() &&
                          // !item?.replies.length > 0 &&
                          showReplyComment === item._id && (
                            <Comment
                              avatar={
                                <Avatar
                                  src={
                                    currentUser?.data?.avatar ||
                                    'https://joeschmoe.io/api/v1/random'
                                  }
                                  alt={currentUser?.data?.name}
                                />
                              }
                              content={
                                <>
                                  <Form
                                    ref={formRef}
                                    onFinish={handleSubmitReplyComment}
                                  >
                                    <Form.Item name="text">
                                      <TextArea
                                        rows={4}
                                        // onChange={handleChangeReplyComment}
                                        // value={valueReplyComment}
                                      />
                                    </Form.Item>
                                    <Form.Item>
                                      <Button
                                        htmlType="submit"
                                        // loading={loading}
                                        type="primary"
                                      >
                                        Add Comment
                                      </Button>
                                    </Form.Item>
                                  </Form>
                                </>
                              }
                            />
                          )}
                      </>
                    }
                  />
                </li>
              )}
            />
          </Fragment>
        ) : (
          <Empty />
        )}
        {!checkUserCommented() && order?.data?.length > 0 && (
          <Comment
            avatar={
              <Avatar
                src={
                  currentUser?.data?.avatar ||
                  'https://joeschmoe.io/api/v1/random'
                }
                alt={currentUser?.data?.name}
              />
            }
            content={
              <Editor
                onSubmit={handleSubmit}
                onChange={handleChange}
                value={value}
                submitting={loading}
              />
            }
          />
        )}
      </div>
      {comments?.paging?.current_page < comments?.paging?.last_page && (
        <div
          onClick={loadMoreComments}
          ref={dummy}
          style={{
            color: '#5191FA',
            fontSize: '1.4rem',
            marginTop: '1.5rem',
            cursor: 'pointer',
          }}
        >
          Xem thêm
        </div>
      )}
    </Fragment>
  );
}
