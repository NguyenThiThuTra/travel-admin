import { unwrapResult } from '@reduxjs/toolkit';
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Typography,
  Upload,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import provincesOpenApi from '../../../api/provincesOpenApi';
import { ErrorMessage } from '../../../common/ErrorMessage';
import { LabelRequired } from '../../../common/LabelRequired';
import {
  formItemLayout,
  tailFormItemLayout,
} from '../../../constants/FormLayoutAnt';
import {
  addDestination,
  fetchDestination,
  updateDestination,
} from '../../../features/Destinations/DestinationsSlice';
import { objectToFormData } from '../../../helpers/ConvertObjectToFormData';
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function ActionFormDestination() {
  let { action, id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.homestay.loading);
  //upload image
  const [previewVisible, setPreviewVisible] = React.useState(false);

  const [fileAvatar, setFileAvatar] = useState();
  const [fileList, setFileList] = useState([]);
  const [fileListGallery, setFileListGallery] = useState([]);

  const onChangeAvatar = ({ file, fileList }) => {
    setFileList((prev) => fileList);
    let originFileObj = file.originFileObj;
    originFileObj.preview = URL.createObjectURL(originFileObj);
    setFileAvatar((prev) => originFileObj);
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

  //end upload image
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data) => {
    if (action === 'add') {
      let formData = objectToFormData(data);
      fileAvatar && formData.append('avatar', fileAvatar);
      fileListGallery.forEach((file) => {
        formData.append('images', file);
      });
      dispatch(addDestination(formData));
    }
    if (action !== 'add' && id) {
      const { description, ...rest } = data;
      var formData = new FormData();
      formData.append('description', description);
      fileAvatar && formData.append('avatar', fileAvatar);
      fileListGallery.forEach((file) => {
        formData.append('images', file);
      });
      await dispatch(
        updateDestination({
          id: id,
          destination: formData,
        })
      );
    }

    // form.resetFields();
    // history.push('/admin/homestays');
  };

  //get province
  const [listProvinces, setListProvinces] = useState(null);

  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setListProvinces(response);
    }
    getProvinces();
  }, []);
  const [dataDetail, setDataDetail] = React.useState();
  const [url_avatar, set_url_avatar] = useState('');
  const [imageGallery, setImageGallery] = useState();
  useEffect(() => {
    async function fetchDataDetail() {
      if (id) {
        try {
          const resultAction = await dispatch(fetchDestination(id));
          const originalPromiseResult = await unwrapResult(resultAction);
          const { description, images, avatar, ...rest } =
            originalPromiseResult?.data;
          // handle result here
          setDataDetail(originalPromiseResult?.data);

          reset({
            images,
            avatar,
            description,
          });
          set_url_avatar(originalPromiseResult?.data?.avatar);
          setImageGallery(originalPromiseResult?.data?.images);
        } catch (rejectedValueOrSerializedError) {
          // handle error here
          console.error({ rejectedValueOrSerializedError });
        }
      }
    }

    fetchDataDetail();
    /* eslint-disable */
  }, [id]);
  //end province

  function onSearch(val) {
    console.log('search:', val);
  }
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
          {action === 'add' ? 'Thêm mới điểm đến' : 'Cập nhật điểm đến'}
        </Title>
      </div>

      <Form
        onFinish={handleSubmit(onSubmit)}
        style={{ display: 'flex', flexDirection: 'column' }}
        {...formItemLayout}
        scrollToFirstError
      >
        <div style={{ alignSelf: 'center', marginBottom: '2rem' }}>
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
        {action !== 'add' && (
          <Form.Item label="ID điểm đến">
            <Controller
              control={control}
              rules={{
                required: false,
              }}
              render={({ field }) => {
                return <Input defaultValue={id} disabled />;
              }}
            />
            {errors?._id && <ErrorMessage />}
          </Form.Item>
        )}
        {(action === 'add' || dataDetail) && (
          <Form.Item
            label={<LabelRequired title="Điểm đến" />}
            className={
              errors?.province &&
              'ant-form-item-with-help ant-form-item-has-error'
            }
          >
            <Controller
              name="province"
              control={control}
              rules={{
                required: action === 'add',
              }}
              render={({ field: { onChange, value } }) => {
                const handleOnChange = (val) => {
                  const province = JSON.parse(val);
                  onChange(province);
                };
                return (
                  <Select
                    defaultValue={JSON.stringify(dataDetail?.province)}
                    disabled={action !== 'add'}
                    placeholder="Tỉnh/Thành phố"
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
                    {listProvinces?.map(({ code, name }) => (
                      <Option
                        key={code}
                        value={JSON.stringify({
                          code,
                          name,
                        })}
                      >
                        {name}
                      </Option>
                    ))}
                  </Select>
                );
              }}
            />

            {errors?.province && <ErrorMessage />}
          </Form.Item>
        )}

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
                  placeholder="..."
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              );
            }}
          />
          {errors?.description && <ErrorMessage />}
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
          >
            {fileList.length < 1 && '+ Upload'}
          </Upload>
        </Form.Item>
        <Form.Item
          label={<LabelRequired title="Ảnh homestay" />}
          className={
            errors?.images && 'ant-form-item-with-help ant-form-item-has-error'
          }
        >
          <Controller
            name="images"
            control={control}
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
              src={fileAvatar?.thumbUrl}
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
