// src/components/RegisterForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Очищаем ошибку при изменении поля
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        // Валидация
        const errors = {};
        if (!formData.username.trim()) errors.username = 'Username is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        if (!formData.password.trim()) errors.password = 'Password is required';

        if (Object.keys(errors).length > 0) {
            console.log("REG FORM  ", errors)
            setFormErrors(errors);
            return;
        }

        try {
            const result = await dispatch(registerUser(formData));

            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            } else {
                setFormErrors({ apiError: result.payload || 'Register failed' });
            }
        } catch (err) {
            setFormErrors({ apiError: 'An unexpected error occurred' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            <h2>Register</h2>

            {formErrors.apiError && (
                <div className="error-message">
                    {formErrors.apiError}
                </div>
            )}

            <div className="form-group">
                <label>Name:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={formErrors.username ? 'error-field' : ''}
                />
                {formErrors.username && (
                    <span className="field-error">{formErrors.username}</span>
                )}
            </div>

            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={formErrors.email ? 'error-field' : ''}
                />
                {formErrors.email && (
                    <span className="field-error">{formErrors.email}</span>
                )}
            </div>

            <div className="form-group">
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={formErrors.password ? 'error-field' : ''}
                />
                {formErrors.password && (
                    <span className="field-error">{formErrors.password}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="submit-button"
            >
                {isLoading ? (
                    <>
                        <span className="spinner"></span> Loading...
                    </>
                ) : (
                    'Register'
                )}
            </button>
        </form>
    );
};

export default RegisterForm;