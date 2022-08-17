import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Typography,
  Upload,
  Checkbox,
  Col,
  Row
} from 'antd';
import { ErrorMessage } from 'common/ErrorMessage';
import { LabelRequired } from 'common/LabelRequired';
import { formItemLayout, tailFormItemLayout } from 'constants/FormLayoutAnt';
import { PERMISSIONS } from 'constants/permissions';
import { ROOM_TYPES } from 'constants/room';
import { RouteConstant } from 'constants/RouteConstant';
import { getHomestay } from 'features/Homestay/HomestaySlice';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  addRoom,
  getCategory,
  updateCategory,
  updateRoom,
} from '../../../features/Rooms/RoomsSlice';
import { objectToFormData } from '../../../helpers/ConvertObjectToFormData';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export default function ActionFormRoom() {
  let { action, id, homestay_id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const loading = useSelector((state) => state.room.loading);
  //upload image
  const [previewVisible, setPreviewVisible] = React.useState(false);

  const [fileAvatar, setFileAvatar] = useState();
  const [fileList, setFileList] = useState([]);
  const [fileListGallery, setFileListGallery] = useState([]);

  const onChangeAvatar = ({ file, fileList }) => {
    setFileList((prev) => fileList);
    let originFileObj = file;
    if (fileList?.length > 0) {
      originFileObj.preview = URL.createObjectURL(originFileObj);
      setFileAvatar((prev) => originFileObj);
    }
  };
  const onChangeImageGallery = ({ file, fileList }) => {
    if (file.status !== 'removed') {
      setFileListGallery((prev) => [...prev, file]);
    }
  };
  //previewImage
  useEffect(() => {
    return () => {
      fileAvatar && URL.revokeObjectURL(fileAvatar.preview);
    };
  }, [fileAvatar]);
  const onRemove = () => {
    setFileAvatar(null);
  };
  const onRemoveImageGallery = (file) => {
    setFileListGallery((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  const handleCancel = () => {
    setPreviewVisible(false);
  };
  const onPreview = (file) => {
    setPreviewVisible(true);
  };

  //get data detail
  const [dataDetail, setDataDetail] = useState(null);
  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({});
  const [url_avatar, set_url_avatar] = useState('');
  const [imageGallery, setImageGallery] = useState();
  //default form data
  useEffect(() => {
    async function defaultFormUser() {
      if (action === 'add') {
        let resetFormFields = {};
        if (homestay_id) {
          const homestay = await dispatch(getHomestay(homestay_id)).unwrap();
          const user_id = homestay?.data?.user_id;
          resetFormFields = {
            ...resetFormFields,
            homestay_id,
            user_id,
          };
        }
        reset(resetFormFields);
      }
    }
    defaultFormUser();
  }, [currentUser, homestay_id]);

  useEffect(() => {
    if (!id) return;
    async function fetchDataDetail() {
      try {
        const originalPromiseResult = await dispatch(getCategory(id)).unwrap();
        // handle result here
        setDataDetail(originalPromiseResult?.data);
        const {
          name,
          type,
          quantity,
          price,
          description,
          images,
          avatar,
          homestay_id,
          user_id,
          amenities
        } = originalPromiseResult?.data;
        reset({
          user_id,
          homestay_id,
          name,
          type,
          quantity,
          price,
          description,
          images,
          avatar,
          amenities
        });
        set_url_avatar(avatar);
        setImageGallery(images);
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error({ rejectedValueOrSerializedError });
      }
    }

    fetchDataDetail();
    /* eslint-disable */
  }, [id]);
  // handle check in & check out

  const onSubmit = async (data) => {
    try {
      if (action === 'add') {
        let formData = objectToFormData(data);

        fileAvatar && formData.append('avatar', fileAvatar);
        fileListGallery.forEach((file) => {
          formData.append('images', file);
        });
        await dispatch(addRoom(formData)).unwrap();
      }
      if (action !== 'add' && id) {
        const { homestay_id, ...rest } = data;
        let formData = objectToFormData(rest);
        fileAvatar && formData.append('avatar', fileAvatar);
        fileListGallery.forEach((file) => {
          formData.append('images', file);
        });
        await dispatch(
          updateCategory({
            id: id,
            category: formData,
          })
        ).unwrap();
      }

      history.goBack();
    } catch (e) {
      message.error('Error');
    }
  };
  function onSearch(val) {
    // console.log('search:', val);
  }

  const amenitiesAndOptions = [
    { label: 'Điều hòa không khí', value: 'Điều hòa không khí' },
    { label: 'Phòng tắm riêng trong phòng', value: 'Phòng tắm riêng trong phòng' },
    { label: 'TV màn hình phẳng', value: 'TV màn hình phẳng' },
    { label: 'Hệ thống cách âm', value: 'Hệ thống cách âm' },
    { label: 'Minibar', value: 'Minibar' },
    { label: 'WiFi miễn phí', value: 'WiFi miễn phí' },
    { label: 'Tầm nhìn ra khung cảnh', value: 'Tầm nhìn ra khung cảnh' },
    { label: 'Đồ vệ sinh cá nhân miễn phí ', value: 'Đồ vệ sinh cá nhân miễn phí ' },
    { label: 'Áo choàng tắm', value: 'Áo choàng tắm' },
    { label: 'Két an toàn ', value: 'Két an toàn ' },
    { label: 'Nhà vệ sinh', value: 'Nhà vệ sinh' },
    { label: 'Bồn tắm', value: 'Bồn tắm' },
    { label: 'Khăn tắm', value: 'Khăn tắm' },
    { label: 'Ga trải giường', value: 'Ga trải giường' },
    { label: 'Bàn làm việc ', value: 'Bàn làm việc ' },
    { label: 'Khu vực tiếp khách', value: 'Khu vực tiếp khách' },
    { label: 'TV', value: 'TV' },
    { label: 'Dép', value: 'Dép' },
    { label: 'Điện thoại', value: 'Điện thoại' },
    { label: 'Khăn tắm/Bộ khăn trải giường (có thu phí)', value: 'Khăn tắm/Bộ khăn trải giường (có thu phí)' },
    { label: 'Máy sấy tóc ', value: 'Máy sấy tóc ' },
    { label: 'Ấm đun nước điện', value: 'Ấm đun nước điện' },
    { label: 'Truyền hình cáp', value: 'Truyền hình cáp' },
    { label: 'Tủ hoặc phòng để quần áo', value: 'Tủ hoặc phòng để quần áo' },
    { label: 'Nắp che ổ cắm điện an toàn', value: 'Nắp che ổ cắm điện an toàn' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          onClick={() => history.goBack()}
          style={{ alignSelf: 'flex-end' }}
          type="primary"
          icon={
            <IoIosArrowBack
              style={{ top: '2.5px', left: '-5px', position: 'relative' }}
            />
          }
          size="large"
        >
          Quay lại
        </Button>
        <Title level={3} align="center">
          {action === 'add' ? 'Thêm mới phòng' : 'Cập nhật phòng'}
        </Title>
      </div>

      <Form
        onFinish={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column' }}
        {...formItemLayout}
        scrollToFirstError
      >
        <div style={{ alignSelf: 'center', marginBottom: '1rem' }}>
          <Image
            style={{
              border: '2px solid #ffffff',
            }}
            width={120}
            height={120}
            src={(fileAvatar ? fileAvatar?.preview : url_avatar) || ''}
            fallback="data:image/png;base64,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"
          />
        </div>

        {action !== 'add' && dataDetail && (
          <Form.Item label={<LabelRequired title="ID phòng" />}>
            <Input defaultValue={dataDetail?._id} disabled />
          </Form.Item>
        )}

        {/* <Form.Item
          label={<LabelRequired title="ID người dùng" />}
          className={
            errors?.user_id && 'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="user_id"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return <Input {...field} />;
            }}
          />
          {errors?.user_id && <ErrorMessage />}
        </Form.Item> */}
        <Form.Item
          label={<LabelRequired title="ID homestay" />}
          className={
            errors?.homestay_id &&
            'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="homestay_id"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return <Input disabled={!!homestay_id} {...field} />;
            }}
          />
          {errors?.homestay_id && <ErrorMessage />}
        </Form.Item>

        <Form.Item
          label={<LabelRequired title="User ID" />}
          className={
            errors?.user_id && 'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="user_id"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return <Input disabled={!!homestay_id} {...field} />;
            }}
          />
          {errors?.homestay_id && <ErrorMessage />}
        </Form.Item>

        <Form.Item
          label={<LabelRequired title="Tên" />}
          style={{ margin: errors?.name && 0 }}
          className={
            errors?.name && 'ant-form-item-with-help ant-form-item-has-error'
          }
          tooltip="Tên phòng của bạn?"
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return <Input {...field} />;
            }}
          />
          {errors?.name && <ErrorMessage />}
        </Form.Item>
        {(action === 'add' || dataDetail) && (
          <Form.Item
            label={<LabelRequired title={`Loại phòng & số lượng`} />}
            className={
              (errors?.type || errors?.quantity) &&
              'ant-form-item-with-help ant-form-item-has-error'
            }
          >
            <Controller
              name="type"
              defaultValue={dataDetail?.type}
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => {
                const handleOnChange = (val) => {
                  onChange(val);
                };
                return (
                  <Select
                    defaultValue={dataDetail?.type}
                    placeholder="Loại phòng"
                    showSearch
                    style={{ width: 200 }}
                    optionFilterProp="children"
                    onChange={(value) => handleOnChange(value)}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {ROOM_TYPES?.map(({ id, type }) => (
                      <Option key={id} value={type}>
                        {type}
                      </Option>
                    ))}
                  </Select>
                );
              }}
            />
            {action === 'add' && (
              <Fragment>
                <Controller
                  name="quantity"
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <InputNumber
                      style={{ width: 150 }}
                      placeholder="Số lượng phòng"
                      min={1}
                      {...field}
                    />
                  )}
                />
                {(errors?.type || errors?.quantity) && <ErrorMessage />}
              </Fragment>
            )}
          </Form.Item>
        )}

        <Form.Item
          label={<LabelRequired title="Giá phòng" />}
          className={
            errors?.price && 'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="price"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return (
                <InputNumber
                  style={{ minWidth: 200 }}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  placeholder="Giá phòng"
                  min={1}
                  {...field}
                />
              );
            }}
          />
          {errors?.price && <ErrorMessage />}
        </Form.Item>

        <Form.Item
          label={<LabelRequired title="Mô tả" />}
          className={
            errors?.description &&
            'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return (
                <TextArea
                  {...field}
                  placeholder="Mô tả"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              );
            }}
          />
          {errors?.description && <ErrorMessage />}
        </Form.Item>

        <Form.Item
          label={<LabelRequired title="Các tiện ích" />}
          className={
            errors?.amenities &&
            'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="amenities"
            control={control}
            rules={{
              required: true,
            }}
            render={({ field }) => {
              return (
                <Checkbox.Group style={{ width: '100%' }}  {...field} >
                  <Row gutter={[8, 8]}>

                    {amenitiesAndOptions.map((option, index) => <Col key={index} span={8}>
                      <Checkbox value={option.value}>{option.label}</Checkbox>
                    </Col>)}

                  </Row>
                </Checkbox.Group>
              );
            }}
          />
          {errors?.amenities && <ErrorMessage />}
        </Form.Item>
        
        <Form.Item
          label="Ảnh đại diện"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Upload
            onRemove={onRemove}
            fileList={fileList}
            listType="picture-card"
            onChange={onChangeAvatar}
            onPreview={onPreview}
            beforeUpload={() => false}
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
        </Form.Item>
        <Form.Item
          label="Ảnh phòng"
          className={
            errors?.images && 'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="images"
            control={control}
            rules={{
              required: false,
            }}
            render={({ field }) => {
              return (
                <Upload
                  {...field}
                  listType="picture-card"
                  fileList={fileListGallery}
                  onPreview={onPreview}
                  onChange={onChangeImageGallery}
                  onRemove={onRemoveImageGallery}
                  beforeUpload={() => false} // return false so that antd doesn't upload the picture right away
                >
                  {fileListGallery.length >= 8 ? null : (
                    <div className="ant-upload-text">Upload</div>
                  )}
                </Upload>
              );
            }}
          />
          {errors?.images && <ErrorMessage />}

          <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
            <img
              alt="example"
              style={{ width: '100%' }}
              src={fileAvatar?.preview}
            />
          </Modal>
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            disabled={loading}
            loading={loading}
            type="primary"
            htmlType="submit"
          >
            {action === 'add' ? ' Thêm mới' : 'Cập nhật'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
