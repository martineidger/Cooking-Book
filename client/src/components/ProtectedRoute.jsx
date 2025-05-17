// src/components/ProtectedRoute.js
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = () => {
    const { isAuthenticated, user } = useSelector(state => state.auth);
    console.log('PROTECTED ROUTE', isAuthenticated, user)

    if (!isAuthenticated) {
        toast.info('Пожалуйста, войдите для доступа к этой странице');
        //return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;