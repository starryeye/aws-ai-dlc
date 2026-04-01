import axios from 'axios';
import { getCredentials, clearAll } from '../utils/storage';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const credentials = getCredentials();
  if (credentials?.token) {
    config.headers.Authorization = `Bearer ${credentials.token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAll();
      window.location.href = '/table/setup';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
