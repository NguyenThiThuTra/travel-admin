import { yupResolver } from '@hookform/resolvers/yup';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Modal,
  Select,
  Typography,
  Upload,
} from 'antd';
import provincesOpenApi from 'api/provincesOpenApi';
import { ErrorMessage } from 'common/ErrorMessage';
import { LabelRequired } from 'common/LabelRequired';
import { formItemLayout, tailFormItemLayout } from 'constants/FormLayoutAnt';
import {
  addHomestay,
  getHomestay,
  updateHomestay,
} from 'features/Homestay/HomestaySlice';
import { objectToFormData } from 'helpers/ConvertObjectToFormData';
import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as yup from 'yup';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

export default function ActionFormHomestay() {
  let { action, id } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.homestay.loading);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const validationSchema = yup.object({
    user_id: yup.string().required('Required'),
    name: yup.string().required('Required'),
    description: yup.string().required('Required'),
    // ...(action === 'add' ? { avatar: yup.array().required('Required') } : {}),
    addresses: yup.object({
      province: yup.object({
        code: yup.number().required(),
        name: yup.string().required(),
      }),
      district: yup.object({
        code: yup.number().required(),
        name: yup.string().required(),
      }),
      ward: yup.object({
        code: yup.number().required(),
        name: yup.string().required(),
      }),
      address: yup.string().required(),
    }),
  });
  //upload image
  const [previewVisible, setPreviewVisible] = useState(false);

  const [fileAvatar, setFileAvatar] = useState();
  const [fileList, setFileList] = useState([]);
  const [fileListGallery, setFileListGallery] = useState([]);

  const onChangeAvatar = ({ file, fileList }) => {
    setFileList((prev) => fileList);
    let originFileObj = file;
    originFileObj.preview = URL.createObjectURL(originFileObj);
    setFileAvatar((prev) => originFileObj);
    // setValue('avatar', originFileObj.preview);
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
  const [dataDetail, setDataDetail] = useState();
  //get addresses
  const [listProvinces, setListProvinces] = useState(null);
  const [provinceCode, setProvinceCode] = useState(null);
  const [listDistricts, setDistricts] = useState(null);
  const [districtCode, setDistrictCode] = useState(null);
  const [listWards, setListWards] = useState(null);
  const {
    handleSubmit,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  console.log({ errors });
  useEffect(() => {
    async function setInitialValues() {
      if (currentUser?.data?._id) {
        try {
          reset({
            user_id: currentUser?.data?._id,
          });
        } catch (rejectedValueOrSerializedError) {
          // handle error here
          console.error({ rejectedValueOrSerializedError });
        }
      }
    }

    setInitialValues();
    /* eslint-disable */
  }, []);
  const [url_avatar, set_url_avatar] = useState('');
  const [imageGallery, setImageGallery] = useState();
  useEffect(() => {
    async function fetchDataDetail() {
      if (id) {
        try {
          const resultAction = await dispatch(getHomestay(id));
          const originalPromiseResult = await unwrapResult(resultAction);
          const { user_id, name, description, images, addresses, ...rest } =
            originalPromiseResult?.data;
          // handle result here
          setDataDetail(originalPromiseResult?.data);
          setProvinceCode(addresses?.province.code);
          setDistrictCode(addresses?.district.code);
          reset({
            user_id,
            name,
            description,
            images,
            addresses,
            address: addresses?.address,
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

  const onSubmit = async (data) => {
    const { address, province, district, ward, ...rest } = data;
    const role = currentUser?.data?.roles;
    try {
      if (action === 'add') {
        let payload = rest;
        let formData = objectToFormData(payload);
        fileAvatar && formData.append('avatar', fileAvatar);
        fileListGallery.forEach((file) => {
          formData.append('images', file);
        });
        await dispatch(addHomestay(formData)).unwrap();
      }
      if (action !== 'add' && id) {
        let formData = objectToFormData(rest);
        fileAvatar && formData.append('avatar', fileAvatar);
        fileListGallery.forEach((file) => {
          formData.append('images', file);
        });
        await dispatch(
          updateHomestay({
            id: id,
            homestay: formData,
          })
        ).unwrap();
      }
      reset({
        user_id: currentUser?.data?._id,
      });
      if (role === 'user') {
        history.push('/my-homestay/homestays');
      }
      if (role === 'admin') {
        history.push('/admin/homestays');
      }
    } catch (error) {
      message.error('Error');
    }
  };

  //detect addresses

  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setListProvinces(response);
    }
    getProvinces();
  }, []);

  useEffect(() => {
    if (provinceCode) {
      async function getDistricts() {
        const response = await provincesOpenApi.getDistricts(provinceCode);
        setDistricts(response.districts);
        setListWards(null);
      }
      getDistricts();
    }
    return;
  }, [provinceCode]);
  useEffect(() => {
    if (districtCode) {
      async function getWards() {
        const response = await provincesOpenApi.getWards(districtCode);
        setListWards(response.wards);
      }
      getWards();
    }
    return;
  }, [districtCode]);
  //end addresses

  function onSearch(val) {
    // console.log('search:', val);
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
          {action === 'add' ? 'Thêm mới homestay' : 'Cập nhật homestay'}
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
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
          />
        </div>
        {action !== 'add' && dataDetail && (
          <Form.Item label={<LabelRequired title="ID homestay" />}>
            <Input defaultValue={dataDetail?._id} disabled />
          </Form.Item>
        )}
        {currentUser?.data?._id && (
          <Form.Item
            label={<LabelRequired title="ID người dùng" />}
            className={
              errors?.user_id &&
              'ant-form-item-with-help ant-form-item-has-error'
            }
          >
            <Controller
              name="user_id"
              control={control}
              rules={{
                required: true,
              }}
              defaultValue={currentUser?.data?._id}
              render={({ field }) => {
                return (
                  <Input
                    {...field}
                    disabled={
                      action !== 'add' || currentUser?.data?.roles === 'user'
                    }
                  />
                );
              }}
            />
            {errors?.user_id && <ErrorMessage />}
          </Form.Item>
        )}

        <Form.Item
          label={<LabelRequired title="Tên" />}
          style={{ margin: errors?.name && 0 }}
          className={
            errors?.name && 'ant-form-item-with-help ant-form-item-has-error'
          }
          tooltip="Tên homestay của bạn?"
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
                  placeholder="Địa chỉ"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              );
            }}
          />
          {errors?.description && <ErrorMessage />}
        </Form.Item>
        {(action === 'add' || dataDetail) && (
          <Controller
            name="addresses"
            control={control}
            rules={{
              required: true,
            }}
            render={({
              field: { onChange: onChangeAddresses, value: valueAddresses },
            }) => {
              return (
                <Fragment>
                  <Form.Item
                    label={<LabelRequired title="Địa chỉ" />}
                    className={
                      (errors?.addresses?.province ||
                        errors?.addresses?.district ||
                        errors?.addresses?.ward) &&
                      'ant-form-item-with-help ant-form-item-has-error'
                    }
                  >
                    <Input.Group compact>
                      <Controller
                        name="province"
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, value } }) => {
                          const handleOnChange = (val) => {
                            const province = JSON.parse(val);
                            onChange(province);
                            if (valueAddresses?.address) {
                              const { address, ...rest } = valueAddresses;
                              onChangeAddresses({ address, province });
                            } else {
                              onChangeAddresses({ province });
                            }
                            setProvinceCode(province.code);
                          };

                          return (
                            <Select
                              defaultValue={JSON.stringify(
                                dataDetail?.addresses?.province
                              )}
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
                              {listProvinces
                                ?.map(({ code, name }) => ({ code, name }))
                                ?.map(({ code, name }) => (
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

                      <Controller
                        name="district"
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, value } }) => {
                          const handleOnChange = (val) => {
                            const district = JSON.parse(val);
                            onChange(district);
                            const { ward, ...rest } = valueAddresses;
                            onChangeAddresses({
                              ...rest,
                              district,
                            });
                            setDistrictCode(district.code);
                          };
                          return (
                            <Select
                              placeholder="Quận/Huyện"
                              showSearch
                              style={{ width: 200 }}
                              optionFilterProp="children"
                              onChange={(value) => handleOnChange(value)}
                              onSearch={onSearch}
                              value={
                                JSON.stringify(valueAddresses?.district) || null
                              }
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {listDistricts
                                ?.map(({ code, name }) => ({ code, name }))
                                ?.map(({ code, name }) => (
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
                      <Controller
                        name="ward"
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, value } }) => {
                          const handleOnChange = (val) => {
                            const ward = JSON.parse(val);
                            onChange(ward);
                            onChangeAddresses({ ...valueAddresses, ward });
                          };
                          return (
                            <Select
                              placeholder="Phường/Xã"
                              showSearch
                              style={{ width: 200 }}
                              optionFilterProp="children"
                              value={
                                JSON.stringify(valueAddresses?.ward) || null
                              }
                              onChange={(value) => handleOnChange(value)}
                              onSearch={onSearch}
                              filterOption={(input, option) =>
                                option.children
                                  .toLowerCase()
                                  .indexOf(input.toLowerCase()) >= 0
                              }
                            >
                              {listWards
                                ?.map(({ code, name }) => ({ code, name }))
                                ?.map(({ code, name }) => (
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
                    </Input.Group>

                    {(errors?.addresses?.province ||
                      errors?.addresses?.district ||
                      errors?.addresses?.ward) && <ErrorMessage />}
                  </Form.Item>
                  <Form.Item
                    label={<LabelRequired title="Địa chỉ cụ thể" />}
                    className={
                      errors?.address &&
                      'ant-form-item-with-help ant-form-item-has-error'
                    }
                  >
                    <Controller
                      name="address"
                      control={control}
                      rules={{
                        required: true,
                      }}
                      render={({ field: { onChange, value } }) => {
                        const handleOnChange = (address) => {
                          onChange(address);
                          onChangeAddresses({
                            ...valueAddresses,
                            address,
                          });
                        };
                        return (
                          <TextArea
                            onChange={(e) => handleOnChange(e.target.value)}
                            value={value}
                            placeholder="Địa chỉ cụ thể"
                            autoSize={{ minRows: 3, maxRows: 5 }}
                          />
                        );
                      }}
                    />
                    {errors?.addresses?.address && <ErrorMessage />}
                  </Form.Item>
                </Fragment>
              );
            }}
          />
        )}
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
          label="Ảnh homestay"
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
