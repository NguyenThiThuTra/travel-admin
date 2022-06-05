import queryString from 'query-string';
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { ActionTable } from '../../../common/Table/ActionTable';
import CustomTable from '../../../common/Table/CustomTable';
import CustomTitleTable from '../../../common/Table/CustomTitleTable';
import { fetchAllDestinations } from '../../../features/Destinations/DestinationsSlice';
const expandable = {
  expandedRowRender: (record) => <p>description</p>,
};

export default function DestinationsPage(props) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);
  const dispatch = useDispatch();
  const destinations = useSelector((state) => state.destination.destinations);
  const loading = useSelector((state) => state.destination.loading);

  React.useEffect(() => {
    dispatch(fetchAllDestinations(querySearch));
    /* eslint-disable */
  }, [location]);
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
        title: 'Điểm đến',
        width: 220,
        dataIndex: 'province',
        key: 'province',
        render: (n, record) => {
          return <div>{record?.province?.name}</div>;
        },
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'homestay_id',
        key: 'homestay_id',
        width: 150,
        render: (n, record) => {
          return (
            <div>
              {record?.homestay_id.map((id) => (
                <div>#{id}</div>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Số lượng hình ảnh',
        dataIndex: 'images',
        key: 'images',
        width: 140,
        render: (n, record) => {
          return <div>{record?.images?.length}</div>;
        },
      },
      {
        title: 'Created at',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150,
      },
      {
        title: 'Updated at',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 150,
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (r) => (
          <ActionTable
            id={r._id}
            dataDetail={destinations}
            funcDelete={null}
            showActionDelete={false}
          />
        ),
      },
    ],
    [destinations]
  );

  return (
    <div style={{ backgroundColor: '#fff' }}>
      <CustomTable
        rowKey={(r) => r._id}
        onChange={onChangePagination}
        loading={loading}
        columns={columns}
        dataSource={destinations?.data || null}
        pagination={{
          showSizeChanger: true,
          total: destinations?.paging?.total,
          defaultCurrent: Number(querySearch?.page) || 1,
          defaultPageSize: Number(querySearch?.limit) || 10,
        }}
        expandable={expandable}
        title={() => <CustomTitleTable title="Danh sách điểm đến" />}
        // footer={() => <CustomFooterTable title="Here is footer" />}
      />
    </div>
  );
}
