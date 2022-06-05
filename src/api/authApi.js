import axiosClient from './axiosClient';

const authApi = {
  login(payload) {
    const url = '/users/login';
    return axiosClient.post(url, payload);
  },
  signup(payload) {
    const url = '/users/signup';
    return axiosClient.post(url, payload);
  },
};
export default authApi;
