import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser, logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import CreateRecipeModal from './CreateRecipeModal';

const Header = ({ isLoginPage = false }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Обработчик открытия модального окна
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    // Обработчик закрытия модального окна
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    console.log('HEADER', isAuthenticated, user)

    const userName = isAuthenticated && user ? user.username || user.email : 'anonim';
    const userAvatar = isAuthenticated && user ? (
        user.name ? user.name.charAt(0).toUpperCase()
            : user.email.charAt(0).toUpperCase()) : 'a';


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
        const userId = localStorage.getItem('userId')
        navigate(`/profile/${userId}`);
        setIsMenuOpen(false);
    };

    const handleToCollections = () => {
        navigate('/collections');
        setIsMenuOpen(false);
    }

    const handleToFavorites = () => {
        navigate('/collections/favorites');
        setIsMenuOpen(false);
    }

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
        <>
            <CreateRecipeModal
                open={isModalOpen}
                onClose={handleCloseModal}
            />
            <header className="header">

                <div className="header-content">
                    <a onClick={() => navigate("/")}  >
                        <h1 className="logo">Cooker</h1>
                    </a>
                    <button
                        className="menu-item"
                        onClick={handleOpenModal}
                    // onClick={() => navigate('/create')}
                    >
                        <span>Добавить рецепт</span>
                    </button>
                    <button
                        className="menu-item"
                        onClick={() => navigate('/users')}
                    >
                        <span>Повара</span>
                    </button>
                    {!isLoginPage ? (
                        <div className="profile-menu" ref={menuRef}>
                            <div
                                className="profile-button"
                                onClick={toggleMenu}
                                aria-haspopup="true"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="user-name">{userName}</span>
                                <div className="avatar">
                                    {userAvatar}
                                </div>
                            </div>

                            {isMenuOpen && (
                                <div className="dropdown-menu">
                                    <div className="menu-header">
                                        <div className="menu-avatar">
                                            {userAvatar}
                                        </div>
                                        {user && isAuthenticated ? (<div className="menu-user-info">
                                            <span className="menu-username">{user.username || user.email}</span>
                                            <span className="menu-email">{user.email}</span>
                                        </div>) : (
                                            <button className="login-button" onClick={handleLogin}>
                                                Войти
                                            </button>
                                        )}

                                    </div>
                                    {user && isAuthenticated ? (
                                        <>

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
                                            <button
                                                className="menu-item "
                                                onClick={handleToCollections}
                                            >
                                                <span>Мои коллекции</span>
                                            </button>
                                            <button
                                                className="menu-item "
                                                onClick={handleToFavorites}
                                            >
                                                <span>Избранное</span>
                                            </button>
                                            <div className="menu-divider"></div>
                                            <button
                                                className="menu-item logout"
                                                onClick={handleLogout}
                                            >
                                                <span>Выйти</span>
                                            </button>
                                        </>) : (
                                        <>
                                            <div className="menu-divider"></div>
                                            <button
                                                className="menu-item"
                                                onClick={() => navigate('/')}
                                            >
                                                <span>Главная</span>
                                            </button>
                                        </>
                                    )}

                                </div>
                            )}
                        </div>
                    ) : (<></>)}


                </div>
            </header>
        </>
    );
};

export default Header;