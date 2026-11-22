import axios from 'axios';
import { getBackendBaseUrl } from '@/config/env';

const api = axios.create({
  baseURL: getBackendBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dynamically keep baseURL in sync with environment / dev switcher
if (typeof window !== 'undefined') {
  window.addEventListener('fortlio:backend-mode-change', () => {
    api.defaults.baseURL = getBackendBaseUrl();
  });
}

api.interceptors.request.use((config) => {
  // Ensure the latest active backend URL is applied
  config.baseURL = getBackendBaseUrl();

  const token = localStorage.getItem('accessToken');

  if (
    config.url !== '/auth/login' &&
    config.url !== '/auth/register'
  ) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
