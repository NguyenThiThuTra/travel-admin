import { Button, Form, Input } from 'antd';
import { login, useCurrentUserSelector } from 'features/Auth/AuthSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RouteConstant } from 'constants/RouteConstant';
import { PERMISSIONS } from 'constants/permissions';

const LoginPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const currentUser = useSelector(useCurrentUserSelector);

  useEffect(() => {
    if (!currentUser) return false;
    if (currentUser?.data?.roles === PERMISSIONS.admin) {
      history.push(RouteConstant.AdminHomestay.path);
    }
  }, [currentUser]);

  const onFinish = async (values) => {
    try {
      await dispatch(login(values)).unwrap();
    } catch (error) {}
  };

  const onFinishFailed = (errorInfo) => {
    console.error('Failed:', errorInfo);
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        padding: '4rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Form
        name="basic"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 0,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
