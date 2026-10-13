// src/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://awsomecoursesapi.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// افزودن توکن به تمام درخواست‌ها
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// مدیریت خطاهای سراسری
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;