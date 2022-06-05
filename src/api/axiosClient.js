import axios from 'axios';
import queryString from 'query-string';

// Set up default config for http requests here
const baseURLApp =
  process.env.REACT_APP_NODE_ENV === 'Production'
    ? process.env.REACT_APP_API_PRO
    : process.env.REACT_APP_API_DEV;

const axiosClient = axios.create({
  baseURL: baseURLApp,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => {
    if (params.filters && !(typeof params.filters === 'string' || params.filters instanceof String)) {
      params.filters = queryString.stringify(params.filters);
    }
    return queryString.stringify(params);
  },
});
axiosClient.interceptors.request.use(
  async (config) => {
    // Handle token here ...
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error;
  }
);
export default axiosClient;
