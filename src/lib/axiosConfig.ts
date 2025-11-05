import axios from 'axios';
import { API_BASE_URL } from '../constants/api';

// 1. Instance untuk request publik (Login, Register)
export const axiosPublic = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Instance untuk request private (Butuh otentikasi)
export const axiosPrivate = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. Interceptor (Pencegat) Request
// Menambahkan header Authorization ke setiap request 'private'
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. (Opsional) Interceptor Response
// Menangani jika token expired (401 Unauthorized)
axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token tidak valid, hapus data & redirect ke login
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);