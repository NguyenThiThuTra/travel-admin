import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Rate,
  Select,
  Space,
  Typography,
  Upload,
} from 'antd';
import orderApi from 'api/orderApi';
import provincesOpenApi from 'api/provincesOpenApi';
import { useCurrentUserSelector } from 'features/Auth/AuthSlice';
import { addCommentInHomestay } from 'features/Comment/CommentSlice';
import { postReview } from 'features/Reviews/ReviewsSlice';
import { objectToFormData } from 'helpers/ConvertObjectToFormData';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBase64 } from 'utils/getBase64';
import './FormAssessmentHomestay.css';

const { TextArea } = Input;
const { Title } = Typography;

export default function FormAssessmentHomestay({
  handleOk,
  visible,
  handleCancel,
  loading,
  homestay,
}) {
  const dispatch = useDispatch();
  const currentUser = useSelector(useCurrentUserSelector);

  const onFinish = async (values) => {
    let { text, rate } = values;
    const payload = {
      text,
      rate,
      user_id: currentUser?.data?._id,
      homestay_id: homestay?._id,
    };

    let formData = objectToFormData(payload);
    const filesImage = fileListImageReview.map((file) => file.originFileObj);
    filesImage.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await dispatch(addCommentInHomestay(formData)).unwrap();
      await handleCancel();
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };

  // lấy danh sách các tỉnh thành
  const [provinces, setProvinces] = useState(null);
  const [provinceCode, setProvinceCode] = useState(null);
  const [provinceBooking, setProvinceBooking] = useState(null);

  useEffect(() => {
    async function getProvinces() {
      const response = await provincesOpenApi.getAllProvinces();
      setProvinces(response);
    }
    getProvinces();
  }, []);

  const [destinationOrderByUser, setDestinationOrderByUser] = useState(null);
  useEffect(() => {
    if (!provinces) return;

    if (!currentUser) {
      setDestinationOrderByUser(null);
      return;
    }
    async function getProvinces() {
      const user_id = currentUser?.data?._id;
      try {
        const response = await orderApi.getDestinationsOrderByUser(user_id);
        setDestinationOrderByUser(response);
      } catch (error) {
        setDestinationOrderByUser(null);
      }
    }
    getProvinces();
  }, [provinces, currentUser]);
  useEffect(() => {
    if (!provinces) return;
    if (!destinationOrderByUser) {
      return setProvinceBooking(null);
    }
    const arrProvinceHomestay = destinationOrderByUser?.data?.map(
      (order) => order?.addresses?.province?.code
    );
    const dataProvinceBooking = provinces?.filter((province) =>
      arrProvinceHomestay.includes(province?.code)
    );
    setProvinceBooking(dataProvinceBooking);
  }, [provinces, destinationOrderByUser]);

  function onChangeProvince(value) {
    console.log(`selected ${value}`);
    setProvinceCode(value);
  }

  function onBlurProvince() {
    console.log('blur');
  }

  function onFocusProvince() {
    console.log('focus');
  }

  function onSearchProvince(val) {
    console.log('search:', val);
  }

  // upload file
  const [previewVisibleImageReview, setPreviewVisibleImageReview] =
    useState(false);
  const [previewImageImageReview, setPreviewImageImageReview] = useState('');
  const [previewTitleImageReview, setPreviewTitleImageReview] = useState('');
  const [fileListImageReview, setFileListImageReview] = useState([]);

  const handleCancelImageReview = () => setPreviewVisibleImageReview(false);

  const handlePreviewImageReview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImageImageReview(file.url || file.preview);
    setPreviewVisibleImageReview(true);
    setPreviewTitleImageReview(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    );
  };

  const handleChangeImageReview = ({ fileList: newFileList }) => {
    setFileListImageReview(newFileList);
    // set value images antd
  };

  const uploadButtonImageReview = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  return (
    <Modal
      className="form-review"
      visible={visible}
      title={<h3 className="form-review__title">Đánh giá {homestay?.name}</h3>}
      onOk={handleOk}
      onCancel={handleCancel}
      width={800}
      footer={null}
      // footer={[
      //   <Button key="back" onClick={handleCancel}>
      //     Return
      //   </Button>,
      //   <Button
      //     key="submit"
      //     type="primary"
      //     loading={loading}
      //     onClick={handleOk}
      //   >
      //     Submit
      //   </Button>,
      //   <Button
      //     key="link"
      //     href="https://google.com"
      //     type="primary"
      //     loading={loading}
      //     onClick={handleOk}
      //   >
      //     Search on Google
      //   </Button>,
      // ]}
    >
      <Form
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          label="1. Đánh giá"
          name="rate"
          rules={[{ required: true, message: 'Vui lòng chọn đánh giá sao' }]}
        >
          <Rate />
        </Form.Item>

        <Form.Item
          label="2. Nhận xét chỗ nghỉ này"
          name="text"
          rules={[
            { required: true, message: 'Vui lòng nhận xét chỗ nghỉ này' },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Thêm ảnh vào đánh giá của bạn">
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileListImageReview}
            onPreview={handlePreviewImageReview}
            onChange={handleChangeImageReview}
            beforeUpload={() => false}
          >
            {fileListImageReview.length >= 8 ? null : uploadButtonImageReview}
          </Upload>
          <Modal
            visible={previewVisibleImageReview}
            title={previewTitleImageReview}
            footer={null}
            onCancel={handleCancelImageReview}
          >
            <img
              alt="example"
              style={{
                width: '100%',
              }}
              src={previewImageImageReview}
            />
          </Modal>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đăng bài
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
