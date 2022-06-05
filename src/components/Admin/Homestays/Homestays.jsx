import { Switch } from 'antd';
import { ActionTable } from 'common/Table/ActionTable';
import CustomTable from 'common/Table/CustomTable';
import CustomTitleTable from 'common/Table/CustomTitleTable';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import {
  deleteHomestay,
  fetchAllHomestays,
  useHomestayRemovedSelector,
  useHomestaysSelector,
} from 'features/Homestay/HomestaySlice';
import moment from 'moment';
import queryString from 'query-string';
import React, { useMemo } from 'react';
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
  React.useEffect(() => {
    const role = currentUser?.data?.roles;
    if (role) {
      let query = { ...querySearch };
      if (role === 'user') {
        query = {
          ...querySearch,
          filters: {
            user_id: currentUser?.data?._id,
          },
        };
      }
      dispatch(fetchAllHomestays(query));
    }
    /* eslint-disable */
  }, [location, homestayRemoved, currentUser]);
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
        title: 'Id người dùng',
        dataIndex: 'user_id',
        key: 'user_id',
        width: 220,
      },
      {
        title: 'Tên ',
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
        title: 'description',
        width: 250,
        dataIndex: 'description',
        key: 'description',
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
        title: 'Đánh giá',
        dataIndex: 'rate',
        key: 'rate',
        width: 100,
      },
      {
        title: 'Lượt xem',
        dataIndex: 'view',
        key: 'view',
        width: 100,
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

      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        width: 150,
        render: (n, record) => {
          return (
            <Switch
              style={{ opacity: 1 }}
              defaultChecked
              checked={record.active}
              disabled={true}
            />
          );
        },
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (r) => (
          <ActionTable
            id={r._id}
            dataDetail={homestays}
            funcDelete={deleteHomestay}
          />
        ),
      },
    ],
    [homestays]
  );

  return (
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
        expandable={expandable}
        title={() => (
          <CustomTitleTable
            hideAdd={
              currentUser?.data?.roles === 'user' && homestays?.data?.length > 0
            }
            title="Danh sách homestays"
          />
        )}
        // footer={() => <CustomFooterTable title="Here is footer" />}
      />
    </div>
  );
}
