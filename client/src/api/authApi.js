// src/api/authApi.js
import axios from 'axios';
import http from './http';

const API_URL = 'http://localhost:3000/auth';

export const authApi = {
    async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/login`, credentials);
            console.log(response.data)
            this.setAuthData(response.data);
            return response.data;
        } catch (error) {
            //this.clearAuthData();
            throw error.response?.data || error;
        }
    },

    async register(userData) {
        try {
            console.log("API REG", userData)
            const response = await axios.post(`${API_URL}/register`, userData);
            this.setAuthData(response.data);
            return response.data;
        } catch (error) {
            //this.clearAuthData();
            throw error.response?.data || error;
        }
    },

    async refreshTokens() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            const response = await axios.post(`${API_URL}/refresh`, { refreshToken });
            this.setAuthData(response.data);
            return response.data;
        } catch (error) {
            //this.clearAuthData();
            throw error.response?.data || error;
        }
    },

    async logout() {
        this.clearAuthData();
    },

    async fetchCurrentUser() {
        try {
            const id = localStorage.getItem('userId');
            console.log("USER   ", id)
            const response = await http.get(`users/${id}`)
            localStorage.setItem('userRole', response.data.role)
            console.log("RESPONCE    ", response.data)
            this.isAuthenticated = (response.status === 200) ? true : false

            return response.data;
        } catch (error) {
            //this.clearAuthData();
            throw error.response?.data || error;
        }
    },

    async deleteAccount(id) {
        try {
            console.log("DELETING USER   ", id)
            const currentUserId = localStorage.getItem('userId')
            const response = await http.delete(`users/${id}`)
            if (id == currentUserId) {
                this.clearAuthData();
                this.isAuthenticated = false
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    setAuthData({ access_token, refresh_token, id }) {
        console.log('SET ', access_token, refresh_token)
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        this.isAuthenticated = true;
        if (id) {
            localStorage.setItem('userId', id);
        }
    },

    clearAuthData() {
        console.log('CLEAR')
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    },

    getAccessToken() {
        return localStorage.getItem('accessToken');
    },

    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: false
};