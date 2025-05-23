// // src/components/RegisterForm.js
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { registerUser } from '../store/slices/authSlice';
// import { useNavigate } from 'react-router-dom';

// const RegisterForm = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//         username: ''
//     });
//     const [formErrors, setFormErrors] = useState({});
//     const dispatch = useDispatch();
//     const { isLoading, error, isAuthenticated } = useSelector(state => state.auth);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (isAuthenticated) {
//             navigate('/');
//         }
//     }, [isAuthenticated, navigate]);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//         // Очищаем ошибку при изменении поля
//         if (formErrors[e.target.name]) {
//             setFormErrors({
//                 ...formErrors,
//                 [e.target.name]: null
//             });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setFormErrors({});

//         // Валидация
//         const errors = {};
//         if (!formData.username.trim()) errors.username = 'Username is required';
//         if (!formData.email.trim()) errors.email = 'Email is required';
//         if (!formData.password.trim()) errors.password = 'Password is required';

//         if (Object.keys(errors).length > 0) {
//             console.log("REG FORM  ", errors)
//             setFormErrors(errors);
//             return;
//         }

//         try {
//             const result = await dispatch(registerUser(formData));

//             if (result.meta.requestStatus === 'fulfilled') {
//                 navigate('/');
//             } else {
//                 setFormErrors({ apiError: result.payload || 'Register failed' });
//             }
//         } catch (err) {
//             setFormErrors({ apiError: 'An unexpected error occurred' });
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit} className="register-form">
//             <h2>Register</h2>

//             {formErrors.apiError && (
//                 <div className="error-message">
//                     {formErrors.apiError}
//                 </div>
//             )}

//             <div className="form-group">
//                 <label>Name:</label>
//                 <input
//                     type="text"
//                     name="username"
//                     value={formData.username}
//                     onChange={handleChange}
//                     required
//                     className={formErrors.username ? 'error-field' : ''}
//                 />
//                 {formErrors.username && (
//                     <span className="field-error">{formErrors.username}</span>
//                 )}
//             </div>

//             <div className="form-group">
//                 <label>Email:</label>
//                 <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
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
//                     name="password"
//                     value={formData.password}
//                     onChange={handleChange}
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
//                     'Register'
//                 )}
//             </button>
//         </form>
//     );
// };

// export default RegisterForm;

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
    const [touched, setTouched] = useState({
        username: false,
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

        if (!formData.username.trim()) {
            errors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Username can only contain letters, numbers and underscores';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        if (!formData.password.trim()) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter';
        } else if (!/[0-9]/.test(formData.password)) {
            errors.password = 'Password must contain at least one number';
        }

        return errors;
    };

    // Валидация при изменении полей
    useEffect(() => {
        if (touched.username || touched.email || touched.password) {
            setFormErrors(validateForm());
        }
    }, [formData, touched]);

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Валидация при изменении, если поле уже было "тронуто"
        if (touched[name]) {
            setFormErrors(validateForm());
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({
            username: true,
            email: true,
            password: true
        });

        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            const result = await dispatch(registerUser(formData));

            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/');
            } else {
                setFormErrors({
                    apiError: result.payload || 'Registration failed. Please try again.'
                });
            }
        } catch (err) {
            setFormErrors({ apiError: 'An unexpected error occurred. Please try again.' });
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
                <label>Username:</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={() => handleBlur('username')}
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
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                    'Register'
                )}
            </button>
        </form>
    );
};

export default RegisterForm;