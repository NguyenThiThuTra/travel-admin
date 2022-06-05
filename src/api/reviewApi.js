import axiosClient from './axiosClient';

const reviewApi = {
  postReview(payload) {
    const url = '/reviews';
    return axiosClient.post(url, payload);
  },
  getAllReviews(params) {
    const url = '/reviews';
    return axiosClient.get(url, { params });
  },
  getAllReviewDestination(params) {
    const url = '/reviews/destination';
    return axiosClient.get(url, { params });
  },
  getReview(id) {
    const url = `/reviews/${id}`;
    return axiosClient.get(url);
  },
  updateReview(id, payload) {
    const url = `/reviews/${id}`;
    return axiosClient.patch(url, payload);
  },
  deleteReview(id) {
    const url = `/reviews/${id}`;
    return axiosClient.delete(url);
  },
  likeReview(payload) {
    const url = '/reviews/like';
    return axiosClient.post(url, payload);
  },
};
export default reviewApi;
