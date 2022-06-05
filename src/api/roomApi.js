import axiosClient from './axiosClient';

const roomApi = {
  getAll(params) {
    const url = '/rooms';
    return axiosClient.get(url, { params });
  },
  getAllCategory(params) {
    const url = '/category';
    return axiosClient.get(url, { params });
  },
  getAllCategoryInHomestay(params) {
    const url = '/category/categoryInHomestay';
    return axiosClient.get(url, { params });
  },
  getAllTest(params) {
    const url = '/rooms/test';
    return axiosClient.get(url, { params });
  },
  getRoom(id) {
    const url = `/rooms/${id}`;
    return axiosClient.get(url);
  },
  getAllRoomsInMyHomestay(payload) {
    const url = `/rooms/homestays/${payload.user_id}`;
    return axiosClient.get(url, payload.params);
  },
  addRoom(payload) {
    const url = '/rooms';
    return axiosClient.post(url, payload);
  },
  deleteRoom(id) {
    const url = `/rooms/${id}`;
    return axiosClient.delete(url);
  },
  updateRoom(payload) {
    const url = `/rooms/${payload.id}`;
    return axiosClient.patch(url, payload.room);
  },
};
export default roomApi;
