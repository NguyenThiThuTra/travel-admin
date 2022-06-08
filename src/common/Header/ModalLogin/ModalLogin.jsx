import { unwrapResult } from '@reduxjs/toolkit';
import { Button, Checkbox, Form, Input, Modal, Select } from 'antd';
import {
  fetchAllHomestays,
  fetchAllHomestaySearch,
} from 'features/Homestay/HomestaySlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { login, signup } from '../../../features/Auth/AuthSlice';
const { Option } = Select;
const ModalLogin = (props) => {
  // const store = useContext(AuthContext);
  //end context
  const history = useHistory();
  let dispatch = useDispatch();
  const [nameForm, setNameForm] = useState('sign-in');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const loading = useSelector((state) => state.auth.loading);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      props.hideModalLogin();
      setConfirmLoading(false);
    }, 1500);
  };
  const [form] = Form.useForm();

  //login
  const onFinish = async (values) => {
    try {
      if (nameForm === 'sign-in') {
        const currentUser = await dispatch(login(values)).unwrap();
        const user_id = currentUser?.data?._id;
        const resultAction = await dispatch(
          fetchAllHomestays({
            filters: { user_id },
          })
        );
        const originalPromiseResult = await unwrapResult(resultAction);
        const role = currentUser?.data?.roles;
        if (role) {
          if (role === 'admin') {
            history.push('/admin/orders');
          }
          if (role === 'user') {
            history.push('/my-homestay/orders');
          }
        }
      }
      if (nameForm !== 'sign-in') {
        dispatch(signup(values));
      }
    } catch (error) {
      console.log('hihi');
      console.error(error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      form.resetFields();
      props.hideModalLogin();
    }
  }, [currentUser]);

  return (
    <Modal
      maskClosable={false}
      visible={props.visible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={props.hideModalLogin}
      footer={null}
    >
      <h1>
        <Button
          onClick={() => setNameForm('sign-up')}
          style={{
            borderColor: '#ffadd2',
            color: '#c41d7f',
            width: '11.5rem',
            backgroundColor: nameForm === 'sign-up' ? '#fff0f6' : '#fff',
            fontWeight: nameForm === 'sign-up' ? 'bold' : 'normal',
          }}
          size={20}
        >
          Đăng ký
        </Button>
        <Button
          onClick={() => setNameForm('sign-in')}
          style={{
            borderColor: '#ffadd2',
            color: '#c41d7f',
            width: '11.5rem',
            marginLeft: '2rem',
            backgroundColor: nameForm !== 'sign-up' ? '#fff0f6' : '#fff',
            fontWeight: nameForm !== 'sign-up' ? 'bold' : 'normal',
          }}
          size={20}
        >
          Đăng nhập
        </Button>
      </h1>

      <Form
        layout="vertical"
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'E-mail không hợp lệ!',
            },
            {
              required: true,
              message: 'Xin vui lòng điền E-mail của bạn!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            {
              required: true,
              message: 'Mật khẩu ít nhất 6 kí tự !',
              min: 6,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        {nameForm === 'sign-up' && (
          <div>
            <Form.Item
              name="passwordConfirm"
              label="Xác nhận mật khẩu"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Vui lòng xác nhận mật khẩu của bạn !',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error('Vui lòng xác nhận đúng mật khẩu!!')
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              name="name"
              label="Tên của bạn"
              tooltip="Bạn muốn người khác gọi bạn là gì?"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên của bạn!',
                  min: 2,
                  whitespace: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phone_number"
              label="Số điện thoại"
              rules={[
                {
                  required: false,
                  pattern: new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g),
                  message: 'Vui lòng nhập số điện thoại',
                },
              ]}
            >
              <Input
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính">
              <Select placeholder="Chọn giới tính của bạn">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Vui lòng đọc thỏa thuận')),
                },
              ]}
            >
              <Checkbox>
                Tôi đã đọc
                <span
                  style={{
                    color: '#1890ff',
                    fontWeight: '600',
                    marginLeft: '5px',
                  }}
                >
                  thỏa thuận
                </span>
              </Checkbox>
            </Form.Item>
          </div>
        )}
        <Form.Item style={{ paddingTop: '1.5rem' }}>
          <Button disabled={loading} type="primary" htmlType="submit">
            {nameForm === 'sign-up' ? '  Đăng ký' : 'Đăng nhập'}
          </Button>
        </Form.Item>
      </Form>
      {/* <style jsx="true">{`
        .ant-modal-wrap {
          background-image: linear-gradient(to right, #37ccff, #7b22ff);
        }
      `}</style> */}
    </Modal>
  );
};
export default ModalLogin;
