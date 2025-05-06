import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    console.log("USER  ", user)
    console.log("IS AUTH  ", isAuthenticated)

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="header">
            <div className="header-content">
                <h1 className="logo">Cooker</h1>

                {isAuthenticated && user ? (
                    <div className="profile-menu" ref={menuRef}>
                        <div
                            className="profile-button"
                            onClick={toggleMenu}
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="user-name">{user.name || user.email}</span>
                            <div className="avatar">
                                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {isMenuOpen && (
                            <div className="dropdown-menu">
                                <div className="menu-header">
                                    <div className="menu-avatar">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="menu-user-info">
                                        <span className="menu-username">{user.name || user.email}</span>
                                        <span className="menu-email">{user.email}</span>
                                    </div>
                                </div>
                                <div className="menu-divider"></div>
                                <button
                                    className="menu-item"
                                    onClick={handleProfileClick}
                                >
                                    <span>Профиль</span>
                                </button>
                                <button
                                    className="menu-item"
                                    onClick={() => navigate('/')}
                                >
                                    <span>Главная</span>
                                </button>
                                <div className="menu-divider"></div>
                                <button
                                    className="menu-item logout"
                                    onClick={handleLogout}
                                >
                                    <span>Выйти</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="login-button" onClick={handleLogin}>
                        Войти
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;