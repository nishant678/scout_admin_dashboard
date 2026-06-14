import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = 'http://localhost:8080/api';
// const API_BASE = import.meta.env.VITE_API_URL || 'https://scout-spring-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'An error occurred';
    if (err.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setTimeout(() => { window.location.href = '/login'; }, 1000);
    } else if (err.response?.status !== 404 || err.config?.url?.includes('/dashboard')) {
      if (!err.config?.url?.includes('/auth/')) {
        toast.error(msg);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
