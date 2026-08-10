import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../config/constants';

// Centralized Axios Instance configured with single-source API_BASE_URL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies with requests automatically
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: attach authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token') || localStorage.getItem('bt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected network error occurred';
    return Promise.reject({ ...error, customMessage: message });
  }
);

export default api;
