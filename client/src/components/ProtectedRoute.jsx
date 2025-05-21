// // src/components/ProtectedRoute.js
// import { useSelector } from 'react-redux';
// import { Navigate, Outlet, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const ProtectedRoute = () => {
//     const { isAuthenticated, user } = useSelector(state => state.auth);
//     const token = !localStorage.getItem('accessToken')
//     console.log('PROTECTED ROUTE', isAuthenticated, user)
//     const navigate = useNavigate()

//     if (!token || !isAuthenticated) {
//         //navigate('/')
//         return <Navigate to="/no-access" replace />;
//     }

//     return <Outlet />;
// };


// export default ProtectedRoute;


import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
    </Box>
);

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useSelector(state => state.auth);
    const token = localStorage.getItem('accessToken');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        // Даем время Redux на инициализацию состояния
        const timer = setTimeout(() => {
            setIsCheckingAuth(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    console.log('ProtectedRoute check:', {
        token,
        isAuthenticated,
        isLoading,
        isCheckingAuth
    });

    // Пока проверяем аутентификацию - показываем загрузку
    if (isCheckingAuth || isLoading) {
        return <LoadingSpinner />;
    }

    // Если нет токена или не аутентифицирован - редирект
    if (!token || !isAuthenticated) {
        console.log('Redirecting to /no-access');
        return <Navigate to="/no-access" replace />;
    }

    // Все проверки пройдены - разрешаем доступ
    return <Outlet />;
};

export default ProtectedRoute;