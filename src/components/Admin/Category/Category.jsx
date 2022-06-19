import { Switch } from 'antd';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { ActionTable } from 'common/Table/ActionTable';
import CustomTable from 'common/Table/CustomTable';
import CustomTitleTable from 'common/Table/CustomTitleTable';
import {
  deleteRoom,
  fetchAllCategory,
  fetchAllRooms,
  fetchAllRoomsInMyHomestay,
  useRoomRemovedSelector,
  useRoomsLoadingSelector,
  useRoomsSelector,
  useCategorySelector,
} from 'features/Rooms/RoomsSlice';
import { PERMISSIONS } from 'constants/permissions';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function AdminCategoryPage(props) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const rooms = useSelector(useRoomsSelector);
  const loading = useSelector(useRoomsLoadingSelector);
  const currentUser = useSelector(useCurrentUserSelector);
  const roomRemoved = useSelector(useRoomRemovedSelector);
  const category = useSelector(useCategorySelector);

  useEffect(() => {
    const role = currentUser?.data?.roles;
    if (role) {
      const payload = {
        ...querySearch,
      };
      if (role === PERMISSIONS.admin) {
        return dispatch(fetchAllCategory(payload));
      }
      // if (role === PERMISSIONS.user) {
      //   const payload = {
      //     ...querySearch,
      //     filters: {
      //       user_id: currentUser?.data?._id,
      //     },
      //   };
      //   dispatch(fetchAllCategory(payload));
      // }
    }
    /* eslint-disable */
  }, [location, roomRemoved, currentUser]);

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
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: 220,
      },
      {
        title: 'Homestay id',
        dataIndex: 'homestay_id',
        key: 'homestay_id',
        width: 220,
        render: (n, record) => {
          return <div>{record?.homestay_id}</div>;
        },
      },
      {
        title: 'Tên ',
        width: 220,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        render: (n, record) => {
          return <div>{record?.name}</div>;
        },
      },
      {
        title: 'Loại phòng',
        width: 150,
        dataIndex: 'type',
        key: 'type',
        render: (n, record) => {
          return <div>{record?.type}</div>;
        },
      },
      {
        title: 'Giá phòng',
        width: 150,
        dataIndex: 'price',
        key: 'price',
        render: (n, record) => {
          return <div>{record?.price}</div>;
        },
      },
      {
        title: 'Giảm giá',
        dataIndex: 'discount',
        key: 'discount',
        width: 100,
        render: (n, record) => {
          return <div>{record?.discount}</div>;
        },
      },
      {
        title: 'Số lượng phòng',
        width: 150,
        dataIndex: 'quantity',
        key: 'description',
        render: (n, record) => {
          return <div>{record?.quantity}</div>;
        },
      },
      {
        title: 'Mô tả ',
        width: 250,
        dataIndex: 'description',
        key: 'description',
        render: (n, record) => {
          return <div>{record?.description}</div>;
        },
      },
      {
        title: 'Số lượng hình ảnh',
        dataIndex: 'images',
        key: 'images',
        width: 100,
        render: (n, record) => {
          return <div>{record?.images?.length ?? 0}</div>;
        },
      },
      {
        title: 'Số bình luận',
        dataIndex: 'comments_count',
        key: 'comments_count',
        width: 100,
        render: (n, record) => {
          return <div>{record?.homestay_id?.comments_count ?? 0}</div>;
        },
      },

      {
        title: 'Đánh giá',
        dataIndex: 'rate',
        key: 'rate',
        width: 100,
        render: (n, record) => {
          return <div>{record?.homestay_id?.rate ?? 0}</div>;
        },
      },
      {
        title: 'Lượt xem',
        dataIndex: 'view',
        key: 'view',
        width: 100,
        render: (n, record) => {
          return <div>{record?.homestay_id?.view ?? 0}</div>;
        },
      },
      {
        title: 'Created at',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },
      {
        title: 'Updated at',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
        render: (time) => {
          return <div>{moment(time).format('DD/MM/YYYY')} </div>;
        },
      },

      // {
      //   title: 'Trạng thái',
      //   dataIndex: 'status',
      //   key: 'status',
      //   width: 150,
      //   render: (n, record) => {
      //     return (
      //       <Switch
      //         style={{ opacity: 1 }}
      //         defaultChecked
      //         checked={record?.status}
      //         disabled={true}
      //       />
      //     );
      //   },
      // },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (r) => (
          <ActionTable
            id={r._id}
            dataDetail={category}
            funcDelete={deleteRoom}
            showActionDelete={false}
          />
        ),
      },
    ],
    [rooms]
  );

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <CustomTable
        rowKey={(r) => r._id}
        onChange={onChangePagination}
        loading={loading}
        columns={columns}
        dataSource={category?.data || null}
        pagination={{
          showSizeChanger: true,
          total: category?.paging?.total,
          defaultCurrent: Number(querySearch?.page) || 1,
          defaultPageSize: Number(querySearch?.limit) || 10,
        }}
        expandable={expandable}
        title={() => <CustomTitleTable title="Danh sách phòng" />}
        // footer={() => <CustomFooterTable title="Here is footer" />}
      />
    </div>
  );
}
