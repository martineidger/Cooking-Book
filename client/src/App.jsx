import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import './styles/index.scss'
import MainPage from './pages/MainPage';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AuthPage from './pages/AuthPage';
import { fetchCurrentUser } from './store/slices/authSlice';
import RecipePage from './pages/RecipePage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        // Проверяем наличие токена при загрузке приложения
        if (localStorage.getItem('accessToken')) {
            console.log("FETCH USER")
            dispatch(fetchCurrentUser());
        }
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/recipes/:id" element={<RecipePage />} />
            <Route path="/profile" element={<ProfilePage />} />
        </Routes>
    );
}

export default App;