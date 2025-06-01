import axios from 'axios';
import store from '../redux/store';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  responseType: "json",
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    if (!config.url.includes('/auth')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;