import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', // Port mặc định của backend FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor nạp Token trước khi gửi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor bắt lỗi từ Backend (401, 422...)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      // Chuyển hướng về login nếu token hết hạn
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;