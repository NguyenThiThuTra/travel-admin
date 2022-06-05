import axiosClient from './axiosClient';

const destinationApi = {
  getAll(params) {
    const url = '/destinations';
    return axiosClient.get(url, { params });
  },
  getHomestayInDestination(id) {
    const url = `/destinations/${id}/homestays`;
    return axiosClient.get(url);
  },
  addDestination(payload) {
    const url = '/destinations';
    return axiosClient.post(url, payload);
  },
  getDestination(id) {
    const url = `/destinations/${id}`;
    return axiosClient.get(url);
  },
  updateDestination(payload) {
    const url = `/destinations/${payload.id}`;
    return axiosClient.patch(url, payload.destination);
  },
};
export default destinationApi;
