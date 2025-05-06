// src/api/http.js
import axios from 'axios';
import { authApi } from './authApi';

const http = axios.create({
    baseURL: 'http://localhost:3000',
});

http.interceptors.request.use(config => {
    const token = authApi.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await authApi.refreshTokens();
                return http(originalRequest);
            } catch (refreshError) {
                authApi.clearAuthData();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default http;