import React, { useMemo } from 'react';
import { Switch } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import CustomFooterTable from '../../../common/Table/CustomFooterTable';
import CustomTable from '../../../common/Table/CustomTable';
import CustomTitleTable from '../../../common/Table/CustomTitleTable';
import { fetchAllUsers } from '../../../features/Users/UsersSlice';
import { ActionTable } from '../../../common/Table/ActionTable';
import { useLocation, useHistory, useRouteMatch } from 'react-router-dom';
import queryString from 'query-string';
import { deleteUser } from '../../../features/Users/UsersSlice';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function UsersPage(props) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const loading = useSelector((state) => state.users.loading);
  const userRemoved = useSelector((state) => state.users.userRemoved);
  React.useEffect(() => {
    dispatch(fetchAllUsers(querySearch));
    /* eslint-disable */
  }, [location, userRemoved]);
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
        title: 'Full Name',
        width: 220,
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      },
      {
        title: 'Phone',
        dataIndex: 'phone_number',
        key: 'phone_number',
        width: 150,
      },
      {
        title: 'email',
        width: 250,
        dataIndex: 'email',
        key: 'email',
        sorter: (a, b) =>
          a.email.toLowerCase().localeCompare(b.email.toLowerCase()),
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
      },
      {
        title: 'Ngày cập nhật',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
      },
      {
        title: 'Role',
        dataIndex: 'roles',
        key: 'roles',
        width: 120,
      },
      // {
      //   title: 'Active',
      //   dataIndex: 'active',
      //   key: 'active',
      //   width: 150,
      //   render: (n, record) => (
      //     <Switch
      //       style={{ opacity: 1 }}
      //       defaultChecked
      //       checked={record?.active}
      //       disabled={true}
      //     />
      //   ),
      // },
      {
        title: 'Thao tác',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (r) => (
          <ActionTable id={r._id} dataDetail={users} funcDelete={deleteUser}  showActionDelete={false}  />
        ),
      },
    ],
    [users]
  );

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <CustomTable
        rowKey={(r) => r._id}
        onChange={onChangePagination}
        loading={loading}
        columns={columns}
        dataSource={users?.data || null}
        pagination={{
          showSizeChanger: true,
          total: users?.paging?.total,
          defaultCurrent: Number(querySearch?.page) || 1,
          defaultPageSize: Number(querySearch?.limit) || 10,
        }}
        expandable={expandable}
        title={() => <CustomTitleTable title="Danh sách người dùng" />}
        // footer={() => <CustomFooterTable title="Here is footer" />}
      />
    </div>
  );
}
