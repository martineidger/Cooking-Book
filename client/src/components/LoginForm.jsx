// // src/components/LoginForm.js
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser } from '../store/slices/authSlice';
// import { useNavigate } from 'react-router-dom';

// const LoginForm = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [formErrors, setFormErrors] = useState({});
//     const dispatch = useDispatch();
//     const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormErrors({});

//         const errors = {};
//         if (!email.trim()) errors.email = 'Email is required';
//         if (!password.trim()) errors.password = 'Password is required';

//         if (Object.keys(errors).length > 0) {
//             setFormErrors(errors);
//             return;
//         }

//         try {
//             const result = await dispatch(loginUser({ email, password }));

//             if (result.meta.requestStatus === 'fulfilled') {
//                 navigate('/');
//             } else {
//                 setFormErrors({ apiError: result.payload || 'Login failed' });
//             }
//         } catch (err) {
//             setFormErrors({ apiError: 'An unexpected error occurred' });
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="login-form">
//             <h2>Login</h2>

//             {/* Общие ошибки API */}
//             {formErrors.apiError && (
//                 <div className="error-message" style={{ color: 'red', marginBottom: '15px' }}>
//                     {formErrors.apiError}
//                 </div>
//             )}

//             <div className="form-group">
//                 <label>Email:</label>
//                 <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                     className={formErrors.email ? 'error-field' : ''}
//                 />
//                 {formErrors.email && (
//                     <span className="field-error">{formErrors.email}</span>
//                 )}
//             </div>

//             <div className="form-group">
//                 <label>Password:</label>
//                 <input
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     className={formErrors.password ? 'error-field' : ''}
//                 />
//                 {formErrors.password && (
//                     <span className="field-error">{formErrors.password}</span>
//                 )}
//             </div>

//             <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="submit-button"
//             >
//                 {isLoading ? (
//                     <>
//                         <span className="spinner"></span> Loading...
//                     </>
//                 ) : (
//                     'Login'
//                 )}
//             </button>
//         </form>
//     );
// };

// export default LoginForm;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });
    const dispatch = useDispatch();
    const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Валидация email
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Валидация формы
    const validateForm = () => {
        const errors = {};

        if (!email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length < 5) {
            errors.password = 'Password must be at least 6 characters';
        }

        return errors;
    };

    // Валидация при изменении полей
    useEffect(() => {
        if (touched.email || touched.password) {
            setFormErrors(validateForm());
        }
    }, [email, password, touched]);

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const result = await dispatch(loginUser({ email, password }));

            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            } else {
                setFormErrors({
                    apiError: result.payload || 'Login failed. Please check your credentials.'
                });
            }
        } catch (err) {
            setFormErrors({ apiError: 'An unexpected error occurred. Please try again.' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>

            {formErrors.apiError && (
                <div className="error-message">
                    {formErrors.apiError}
                </div>
            )}

            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => handleBlur('email')}
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
                    onBlur={() => handleBlur('password')}
                    className={formErrors.password ? 'error-field' : ''}
                />
                {formErrors.password && (
                    <span className="field-error">{formErrors.password}</span>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading || Object.keys(formErrors).length > 0}
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