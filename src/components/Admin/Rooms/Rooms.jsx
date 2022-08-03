import { Button, Image, Popconfirm, Switch } from 'antd';
import { PERMISSIONS } from 'constants/permissions';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import moment from 'moment';
import queryString from 'query-string';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoChevronBackCircle } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import {
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { ActionTable } from '../../../common/Table/ActionTable';
import CustomTable from '../../../common/Table/CustomTable';
import CustomTitleTable from '../../../common/Table/CustomTitleTable';
import {
  deleteRoom,
  fetchAllRooms,
  fetchAllRoomsInMyHomestay,
  updateRoom,
  useRoomRemovedSelector,
  useRoomsLoadingSelector,
  useRoomsSelector,
  useRoomUpdatedSelector,
} from 'features/Rooms/RoomsSlice';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function RoomsPage(props) {
  const { id, homestay_id } = useParams();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const rooms = useSelector(useRoomsSelector);
  console.log({ rooms });
  const loading = useSelector(useRoomsLoadingSelector);
  const currentUser = useSelector(useCurrentUserSelector);
  const roomRemoved = useSelector(useRoomRemovedSelector);
  const roomUpdated = useSelector(useRoomUpdatedSelector);

  useEffect(() => {
    if (!currentUser) return;

    const payload = {
      ...querySearch,
      filters: {
        category_id: id,
      },
    };
    dispatch(fetchAllRooms(payload));
    /* eslint-disable */
  }, [location, roomRemoved, currentUser, roomUpdated]);

  const onChangePagination = (pagination) => {
    let query = {
      ...querySearch,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    history.push(`${match.path}?${queryString.stringify(query)}`);
  };
  const columns = useMemo(
    () => [
      {
        title: 'STT',
        dataIndex: 'STT',
        key: '_id',
        width: 50,
      },
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: 220,
      },
      {
        title: 'Tên ',
        width: 200,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        render: (n, record) => {
          const category = record?.category_id;
          return <div>{category?.name}</div>;
        },
      },
      {
        title: 'Homestay',
        dataIndex: 'homestay_id',
        key: 'homestay_id',
        width: 200,
        render: (n, record) => {
          const homestay = record?.homestay_id;
          return <div>{homestay?.name}</div>;
        },
      },
      {
        title: 'Loại phòng',
        width: 150,
        dataIndex: 'type',
        key: 'type',
        render: (n, record) => {
          return <div>{record?.category_id?.type}</div>;
        },
      },
      {
        title: 'Giá phòng',
        width: 150,
        dataIndex: 'price',
        key: 'price',
        render: (n, record) => {
          return <div>{record?.category_id?.price}</div>;
        },
      },
      {
        title: 'description',
        width: 250,
        dataIndex: 'description',
        key: 'description',
        render: (n, record) => {
          return <div>{record?.category_id?.description}</div>;
        },
      },
      {
        title: 'Ảnh đại diện',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 250,
        render: (n, record) => {
          const category = record?.category_id;
          return (
            <div>
              {(category?.avatar || category?.images?.[0]) && (
                <Image
                  style={{
                    maxWidth: '235px',
                    maxHeight: '150px',
                    width: '235px',
                    height: '150px',
                    objectFit: 'cover',
                  }}
                  preview={{ visible: false, mask: null }}
                  src={category?.avatar || category?.images?.[0]}
                  alt="image preview"
                />
              )}
            </div>
          );
        },
      },
      {
        title: 'Bộ sưu tập ảnh',
        dataIndex: 'images',
        key: 'gallery',
        width: 250,
        render: (n, record) => {
          const category = record?.category_id;
          const visiblePreviewImageGallery = () => {
            if (category?.images?.length > 1) {
              setImageGallery(category.images);
              setVisiblePreviewGroup(true);
            }
          };
          return (
            <Fragment>
              {category?.images?.length ? (
                <div
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={visiblePreviewImageGallery}
                >
                  <Image
                    style={{
                      filter: 'brightness(80%)',
                      maxWidth: '235px',
                      maxHeight: '150px',
                      width: '235px',
                      height: '150px',
                      objectFit: 'cover',
                    }}
                    preview={{ visible: false }}
                    src={category?.images?.[0]}
                    alt="image preview"
                  />
                  {category?.images?.length > 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        background: 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <AiOutlinePlus fontSize="35px" color="white" />
                      <span
                        style={{
                          fontSize: '30px',
                          color: 'white',
                          fontWeight: '500',
                        }}
                      >
                        {category?.images?.length}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                ''
              )}
            </Fragment>
          );
        },
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },

      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        fixed: 'right',
        width: 120,
        render: (n, record) => {
          return (
            <Popconfirm
              title={
                record.status
                  ? 'Bạn muốn dừng hoạt động của phòng này không?'
                  : 'Bạn muốn mở lại hoạt động của phòng này?'
              }
              onConfirm={() =>
                dispatch(
                  updateRoom({
                    id: record?._id,
                    room: {
                      status: !record?.status,
                      category_id: record?.category_id?._id,
                    },
                  })
                )
              }
              okText="Đồng ý"
              cancelText="Không"
            >
              <Switch
                style={{ opacity: 1 }}
                checked={record.status}
              />
            </Popconfirm>
          );
        },
      },
    ],
    [rooms]
  );

  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <CustomTable
        rowKey={(r) => r._id}
        onChange={onChangePagination}
        loading={loading}
        columns={columns}
        dataSource={rooms?.data || null}
        pagination={{
          showSizeChanger: true,
          total: rooms?.paging?.total,
          defaultCurrent: Number(querySearch?.page) || 1,
          defaultPageSize: Number(querySearch?.limit) || 10,
        }}
        title={() => (
          <CustomTitleTable
            hideAdd={true}
            showButtonBack
            title={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Danh sách phòng
              </span>
            }
          />
        )}
      />

      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: visiblePreviewGroup,
            onVisibleChange: (vis) => setVisiblePreviewGroup(vis),
          }}
        >
          {imageGallery?.map((image, index) => (
            <Image key={index} src={image} alt={`preview ${index}`} />
          ))}
        </Image.PreviewGroup>
      </div>
    </div>
  );
}
