// utils/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
});

// Add a request interceptor to attach the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
