// src/pages/AuthPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import Header from '../components/Header';

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeForm, setActiveForm] = useState('login');

    // Определяем активную форму по URL
    useEffect(() => {
        if (location.pathname === '/register') {
            setActiveForm('register');
        } else if (location.pathname === '/login') {
            setActiveForm('login');
        } else {
            // Если открыт /auth, перенаправляем на /login по умолчанию
            navigate('/login');
        }
    }, [location.pathname, navigate]);

    // Обработчик переключения форм с обновлением URL
    const handleFormToggle = (formType) => {
        setActiveForm(formType);
        navigate(`/${formType}`);
    };

    return (
        <>
            {/* <Header isLoginPage={true} /> */}
            <div className="auth-page">
                <div className="auth-container">
                    <div className="form-wrapper">
                        <div className={`form-slider ${activeForm}`}>
                            <div className="slide">
                                <LoginForm />
                            </div>
                            <div className="slide">
                                <RegisterForm />
                            </div>
                        </div>
                    </div>

                    <div className="auth-toggle">
                        <button
                            className={`toggle-btn ${activeForm === 'login' ? 'active' : ''}`}
                            onClick={() => handleFormToggle('login')}
                        >
                            Login
                        </button>
                        <button
                            className={`toggle-btn ${activeForm === 'register' ? 'active' : ''}`}
                            onClick={() => handleFormToggle('register')}
                        >
                            Register
                        </button>
                        <div className={`slider-track ${activeForm}`}></div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;