import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUsers } from '../store/slices/usersSlice';
import { Link } from 'react-router-dom';
import { Input, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Header from '../components/Header';

const { Search } = Input;

const UsersPage = () => {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.users);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (users) {
            const filtered = users.filter(user =>
                user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users]);

    return (
        <>
            {/* <Header /> */}
            <div className="users-page">
                <div className="users-header">
                    <h1>Все пользователи</h1>
                    <Search
                        placeholder="Поиск пользователей"
                        allowClear
                        enterButton={<SearchOutlined />}
                        size="large"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="users-search"
                    />
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className="users-grid">
                        {filteredUsers.map((user) => (
                            <Link to={`/profile/${user.id}`} key={user.id} className="user-card">
                                <div className="user-avatar">
                                    {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <h3>{user.name || user.email}</h3>
                                    <div className="user-stats">
                                        <span>{user.recipesCount || 0} рецептов</span>
                                        <span>{user.savedRecipesCount || 0} сохранений</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredUsers.length === 0 && (
                    <div className="no-results">
                        <p>Пользователи не найдены</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default UsersPage;