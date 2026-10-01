import axios from 'axios';

const API_URL = process.env.REACT_APP_CMS_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('cms_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          if (res.data?.token) {
            localStorage.setItem('cms_auth_token', res.data.token);
            originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('cms_auth_token');
          localStorage.removeItem('cms_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
