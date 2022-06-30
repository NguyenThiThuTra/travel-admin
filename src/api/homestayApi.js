import axiosClient from './axiosClient';

const homestayApi = {
  getAll(params) {
    const url = '/homestays';
    return axiosClient.get(url, { params });
  },
  getAllSearch(params) {
    const url = '/homestays/search';
    return axiosClient.get(url, { params });
  },
  
  getHomestay(id) {
    const url = `/homestays/${id}`;
    return axiosClient.get(url);
  },
  addHomestay(payload) {
    const url = '/homestays';
    return axiosClient.post(url, payload);
  },
  deleteHomestay(id) {
    const url = `/homestays/${id}`;
    return axiosClient.delete(url);
  },
  updateHomestay(payload) {
    const url = `/homestays/${payload.id}`;
    return axiosClient.patch(url, payload.homestay);
  },
  handleActiveHomestay(payload) {
    const url = `/homestays/${payload.id}/active`;
    return axiosClient.patch(url, payload.homestay);
  },
};
export default homestayApi;
