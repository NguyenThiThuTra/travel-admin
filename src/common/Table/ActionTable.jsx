import { message, Popconfirm } from 'antd';
import queryString from 'query-string';
import React, { Fragment } from 'react';
import { BiEditAlt } from 'react-icons/bi';
import { ImBin } from 'react-icons/im';
import { AiFillEye } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { isEmptyObject } from '../../helpers/isEmptyObject';
export function ActionTable({
  id,
  dataDetail,
  funcDelete,
  showActionDelete = true,
  showActionEdit = true,
  showActionView = false,
  showActionCustom = null,
}) {
  let history = useHistory();
  let match = useRouteMatch();
  let location = useLocation();
  const querySearch = queryString.parse(location.search);

  let dispatch = useDispatch();
  const handleAction = (action) => {
    if (action === 'edit') {
      return history.push(`${match.url}/edit/${id}`);
    }
    if (action === 'detail') {
      return history.push(`${match.url}/${id}`);
    }
  };
  async function confirmDelete() {
    try {
      await dispatch(funcDelete(id)).unwrap();
      await message.success('Xóa thành công');
      if (!isEmptyObject(querySearch) && dataDetail?.results === 1) {
        let query = {
          ...querySearch,
          page: Number(querySearch.page) - 1,
        };
        history.push(`${match.url}?${queryString.stringify(query)}`);
      }
    } catch (e) {
      message.error('Xóa thất bại');
    }
  }

  return (
    <Fragment>
      {showActionView && (
        <AiFillEye
          style={{ marginRight: '15px' }}
          onClick={() => handleAction('detail')}
          cursor="pointer"
          fontSize="20px"
          color="#1890ff"
        />
      )}
      {showActionEdit && (
        <BiEditAlt
          style={{ marginRight: '15px' }}
          onClick={() => handleAction('edit')}
          cursor="pointer"
          fontSize="20px"
          color="rgb(255, 108, 55)"
        />
      )}

      {showActionDelete && (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa không ?"
          onConfirm={confirmDelete}
          okText="Có"
          cancelText="Không"
          placement="left"
        >
          <ImBin cursor="pointer" fontSize="20px" />
        </Popconfirm>
      )}
      {showActionCustom}
    </Fragment>
  );
}
