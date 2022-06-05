import axiosClient from './axiosClient';

const commentApi = {
  addCommentInHomestay(payload) {
    const url = '/comments/homestay';
    return axiosClient.post(url, payload);
  },
  getAllCommentInHomestay({ params, homestay_id }) {
    const url = `/comments/homestay/${homestay_id}`;
    return axiosClient.get(url, { params });
  },
  updateComment(payload) {
    const url = `/comments/${payload.id}`;
    return axiosClient.patch(url, payload.comment);
  },
};
export default commentApi;
