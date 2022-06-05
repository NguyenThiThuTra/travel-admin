import axiosClient from './axiosClient';

const orderApi = {
  add(payload) {
    const url = '/orders';
    return axiosClient.post(url, payload);
  },
  getOne(id) {
    const url = `/orders/${id}`;
    return axiosClient.get(url);
  },
  getAll(params) {
    const url = '/orders';
    return axiosClient.get(url, { params });
  },
  updateOne(payload) {
    const url = `/orders/${payload.id}`;
    return axiosClient.patch(url, payload.order);
  },
  getDestinationsOrderByUser(payload) {
    const url = `/orders/destinations/${payload}`;
    return axiosClient.get(url);
  },
};
export default orderApi;
