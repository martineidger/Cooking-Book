// src/components/LoginForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});

        const errors = {};
        if (!email.trim()) errors.email = 'Email is required';
        if (!password.trim()) errors.password = 'Password is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const result = await dispatch(loginUser({ email, password }));

            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            } else {
                setFormErrors({ apiError: result.payload || 'Login failed' });
            }
        } catch (err) {
            setFormErrors({ apiError: 'An unexpected error occurred' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>

            {/* Общие ошибки API */}
            {formErrors.apiError && (
                <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
                    {formErrors.apiError}
                </div>
            )}

            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                    'Login'
                )}
            </button>
        </form>
    );
};

export default LoginForm;