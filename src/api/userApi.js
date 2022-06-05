import axiosClient from './axiosClient';

const userApi = {
  getAll(params) {
    const url = '/users';
    return axiosClient.get(url, { params });
  },
  addUser(user) {
    const url = '/users/signup';
    return axiosClient.post(url, user);
  },
  getUser(id) {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  deleteUser(id) {
    const url = `/users/${id}`;
    return axiosClient.delete(url);
  },
  updateUser(payload) {
    const url = `/users/${payload.id}`;
    return axiosClient.patch(url, payload.user);
  },
};
export default userApi;
