// src/api/axios.js
import axios from 'axios';

// 1. Define the Base URL
// When you deploy, you will create a .env file to change this automatically.
// For now, it defaults to localhost.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// 2. The "Interceptor" (Magic Token Attacher)
// Before every request, this checks if a token exists and attaches it.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;