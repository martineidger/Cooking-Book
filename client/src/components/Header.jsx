// Header.js
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header>
            <div className="header-content">
                <h1>Cooker</h1>
                {isAuthenticated && user && (
                    <div className="user-info">
                        <span>Hi, {user.name || user.email}</span>
                        <button onClick={handleLogout}>Выйти</button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;