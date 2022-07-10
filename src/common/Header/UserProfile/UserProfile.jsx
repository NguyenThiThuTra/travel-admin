import { UserOutlined } from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Radio,
  Row,
  Upload,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import useWindowSize from 'hooks/useWindowSize';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBase64 } from 'utils/getBase64';
import { getCurrentUser } from '../../../features/Auth/AuthSlice';
import { updateUser } from '../../../features/Users/UsersSlice';
//end upload avatar
const UserProfile = (props) => {
  const [form] = Form.useForm();
  let dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getCurrentUser());
  // }, []);
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        name: currentUser.data.name,
        gender: currentUser.data.gender,
        email: currentUser.data.email,
        phone_number: currentUser.data.phone_number,
      });
    }
  }, [currentUser]);
  //handle image
  const [fileList, setFileList] = useState([]);
  const [fileAvatar, setFileAvatar] = useState();
  const [stateAvatar, setStateAvatar] = useState({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
  });
  const handleCancel = () => this.setState({ previewVisible: false });

  const handlePreview = async (file) => {};

  const onRemove = () => {
    setFileAvatar(null);
  };
  const onChange = async ({ file, fileList }) => {
    setFileList((prev) => fileList);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file);
    }
    setFileAvatar((prev) => file);
    setStateAvatar({
      ...stateAvatar,
      previewImage: file.url || file.preview,
    });
  };

  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setStateAvatar({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };
  //onSubmit form
  const onFinish = async (values) => {
    try {
      const { gender, name, phone_number } = values;
      const formData = new FormData();
      fileAvatar && formData.append('avatar', fileAvatar);
      formData.append('gender', gender);
      formData.append('name', name);
      formData.append('phone_number', phone_number);
      await dispatch(
        updateUser({
          id: currentUser?.data?._id,
          user: formData,
        })
      );
      await dispatch(getCurrentUser());
      // axiosClient.post('/test', formData);
    } catch (e) {
      console.log(e);
    }
  };

  const windowSize = useWindowSize();
  return (
    <Drawer
      title="Thông tin cá nhân"
      width={windowSize?.width > 768 ? 720 : 350}
      onClose={props.onCloseUserProfile}
      visible={props.visibleUserProfile}
      bodyStyle={{ paddingBottom: 80 }}
    >
      {currentUser && (
        <Fragment>
          <div style={{ textAlign: 'center' }}>
            <Avatar
              size={{ xs: 80, sm: 80, md: 80, lg: 80, xl: 80, xxl: 100 }}
              style={{ backgroundColor: '#87d068' }}
              icon={<UserOutlined />}
              src={fileAvatar ? fileAvatar?.preview : currentUser?.data?.avatar}
            />
            <h3>{currentUser?.data?.name}</h3>
          </div>
          <Form
            onFinish={onFinish}
            form={form}
            layout="vertical"
            hideRequiredMark
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} span={12}>
                <label htmlFor="id">Id người dùng</label>
                <Input id="id" defaultValue={currentUser?.data?._id} disabled />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} span={12}>
                <label htmlFor="name">Tên</label>
                <Form.Item name="name" rules={[{ required: false }]}>
                  <Input id="name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} span={12}>
                <label htmlFor="gender">Giới tính</label>
                <div>
                  <Form.Item name="gender" rules={[{ required: false }]}>
                    <Radio.Group name="gender">
                      <Radio value="male">Nam</Radio>
                      <Radio value="female">Nữ</Radio>
                      <Radio value="other">Khác</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} span={12}>
                <label htmlFor="Email">Email</label>
                <Form.Item name="email" rules={[{ required: false }]}>
                  <Input id="Email" disabled />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} span={12}>
                <label htmlFor="phone_number">Số điện thoại</label>
                <Form.Item name="phone_number" rules={[{ required: false }]}>
                  <Input id="phone_number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={24} lg={24} span={24}>
                <label htmlFor="avatar">Ảnh đại diện</label>
                <ImgCrop id="avatar" rotate>
                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChange}
                    onRemove={onRemove}
                    onPreview={onPreview}
                    beforeUpload={() => false}
                  >
                    {fileList.length < 1 && '+ Upload'}
                  </Upload>
                </ImgCrop>
              </Col>
            </Row>
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button
                onClick={props.onCloseUserProfile}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              {/* <Button onClick={props.onCloseUserProfile} type="primary">
            Lưu
          </Button> */}
              <Button htmlType="submit" type="primary">
                Lưu
              </Button>
            </div>
          </Form>
        </Fragment>
      )}
    </Drawer>
  );
};

export default UserProfile;
