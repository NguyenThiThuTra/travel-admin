import axiosClient from './axiosClient';

const paymentApi = {
  createVNPayment(payload) {
    const url = '/payment/VNPayment';
    return axiosClient.post(url, payload);
  },
  ipnVNPayment(payload) {
    const url = `/payment/VNPayment/ipn${payload.query}`;
    return axiosClient.get(url, { params: payload.params });
  },
  returnVNPayment(payload) {
    const url = `/payment/VNPayment/return${payload.query}`;
    return axiosClient.get(url, { params: payload.params });
  },
};
export default paymentApi;
