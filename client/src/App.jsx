import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import './styles/index.scss'

import MainPage from './pages/MainPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from './store/slices/authSlice';

const App = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Проверяем наличие токена при загрузке приложения
        if (localStorage.getItem('accessToken')) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
}

export default App;