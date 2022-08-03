import { Image, Popconfirm, Rate, Switch } from 'antd';
import { ActionTable } from 'common/Table/ActionTable';
import CustomTable from 'common/Table/CustomTable';
import CustomTitleTable from 'common/Table/CustomTitleTable';
import { PERMISSIONS } from 'constants/permissions';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  deleteHomestay,
  fetchAllHomestays,
  handleActiveHomestay,
  useHomestayRemovedSelector,
  useHomestaysSelector,
  useHomestayUpdatedSelector,
} from 'features/Homestay/HomestaySlice';
import moment from 'moment';
import queryString from 'query-string';
import React, { useMemo, useState } from 'react';
import { Fragment } from 'react';
import { AiFillEye, AiOutlinePlus } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function AdminHomestaysPage(props) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const homestays = useSelector(useHomestaysSelector);
  const loading = useSelector((state) => state.homestay.loading);
  const currentUser = useSelector(useCurrentUserSelector);
  const homestayRemoved = useSelector(useHomestayRemovedSelector);
  const homestayUpdated = useSelector(useHomestayUpdatedSelector);

  React.useEffect(() => {
    const role = currentUser?.data?.roles;
    if (role) {
      let query = { ...querySearch, sort: "-createdAt" };
      dispatch(fetchAllHomestays(query));
    }
    /* eslint-disable */
  }, [location, homestayRemoved, currentUser, homestayUpdated]);
  const onChangePagination = (pagination) => {
    let query = {
      ...querySearch,
      page: pagination.current,
      limit: pagination.pageSize,
    };
    history.push(`${match.url}?${queryString.stringify(query)}`);
  };
  const showListCategoryInHomestay = (category_id) => {
    return history.push(`${match.url}/detail/${category_id}/categories`);
  };

  const columns = useMemo(
    () => [
      {
        title: 'ID người dùng',
        dataIndex: 'user_id',
        key: 'user_id',
        width: 220,
        sorter: (a, b) =>
          a.user_id._id
            .toLowerCase()
            .localeCompare(b.user_id._id.toLowerCase()),
        render: (user) => {
          return <div>{user?._id}</div>;
        },
      },
      {
        title: 'Tên homestay ',
        width: 220,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'addresses',
        key: 'addresses',
        width: 150,
        render: (n, record) => {
          return (
            <div>{`${record?.addresses?.address} ${record?.addresses?.ward?.name} ${record?.addresses?.district?.name} ${record?.addresses?.province?.name} `}</div>
          );
        },
      },
      {
        title: 'Mô tả',
        width: 220,
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Đánh giá',
        dataIndex: 'rate',
        key: 'rate',
        width: 150,
        render: (n, record) => {
          return (
            <div>
              {record?.rate ? (
                <Rate
                  style={{
                    fontSize: '15px',
                  }}
                  allowHalf
                  disabled
                  defaultValue={record?.rate}
                />
              ) : (
                'Chưa có đánh giá'
              )}
            </div>
          );
        },
      },
      {
        title: 'Ảnh đại diện',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 250,
        render: (n, record) => {
          return (
            <div>
              {(record?.avatar || record?.images?.[0]) && (
                <Image
                  style={{
                    maxWidth: '235px',
                    maxHeight: '170px',
                    width: '235px',
                    height: '170px',
                    objectFit: 'cover',
                  }}
                  preview={{ visible: false, mask: null }}
                  src={record?.avatar || record?.images?.[0]}
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
          const visiblePreviewImageGallery = () => {
            if (record?.images?.length > 1) {
              setImageGallery(record.images);
              setVisiblePreviewGroup(true);
            }
          };
          return (
            <Fragment>
              {record?.images?.length ? (
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
                      maxHeight: '170px',
                      width: '235px',
                      height: '170px',
                      objectFit: 'cover',
                    }}
                    preview={{ visible: false }}
                    src={record?.images?.[0]}
                    alt="image preview"
                  />
                  {record?.images?.length > 1 && (
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
                        {record?.images?.length}
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
        title: 'Số lượng hình ảnh',
        dataIndex: 'images',
        key: 'images',
        width: 100,
        render: (n, record) => {
          return <div>{record?.images?.length}</div>;
        },
      },
      {
        title: 'Số bình luận',
        dataIndex: 'comments_count',
        key: 'comments_count',
        width: 100,
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
        title: 'Hoạt động',
        dataIndex: 'active',
        key: 'active',
        width: 150,
        render: (n, record) => {
          return (
            <Popconfirm
              title={
                record.active
                  ? 'Bạn muốn dừng hoạt động của homestay?'
                  : 'Bạn muốn mở lại hoạt động của homestay?'
              }
              onConfirm={() =>
                dispatch(
                  handleActiveHomestay({
                    id: record?._id,
                    homestay: { active: !record?.active },
                  })
                )
              }
              okText="Đồng ý"
              cancelText="Không"
            >
              <Switch
                style={{ opacity: 1 }}
                checked={record.active}
              />
            </Popconfirm>
          );
        },
      },
      {
        title: 'Thao tác',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (r) => (
          <ActionTable
            id={r._id}
            dataDetail={homestays}
            funcDelete={deleteHomestay}
            showActionDelete={false}
            showActionCustom={
              <AiFillEye
                onClick={() => showListCategoryInHomestay(r._id)}
                style={{ marginRight: '15px' }}
                cursor="pointer"
                fontSize="20px"
                color="#1890ff"
              />
            }
          />
        ),
      },
    ],
    [homestays]
  );

  // visiblePreviewGroup
  const [visiblePreviewGroup, setVisiblePreviewGroup] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);
  return (
    <Fragment>
      <div style={{ backgroundColor: '#fff' }}>
        <CustomTable
          rowKey={(r) => r._id}
          onChange={onChangePagination}
          loading={loading}
          columns={columns}
          dataSource={homestays?.data || null}
          pagination={{
            showSizeChanger: true,
            total: homestays?.paging?.total,
            defaultCurrent: Number(querySearch?.page) || 1,
            defaultPageSize: Number(querySearch?.limit) || 10,
          }}
          title={() => (
            <CustomTitleTable
              hideAdd={
                currentUser?.data?.roles === PERMISSIONS.user &&
                homestays?.data?.length > 0
              }
              title="Danh sách homestay"
            />
          )}
        />
      </div>

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
    </Fragment>
  );
}
