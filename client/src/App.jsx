import { Routes, Route, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import './styles/index.scss'
import MainPage from './pages/MainPage';
import { useDispatch, useSelector } from 'react-redux';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import AuthPage from './pages/AuthPage';
import { fetchCurrentUser } from './store/slices/authSlice';
import RecipePage from './pages/RecipePage';
import ProfilePage from './pages/ProfilePage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import CollectionsPage from './pages/CollectionsPage';
import ProtectedRoute from './components/ProtectedRoute';
import UsersPage from './pages/UsersPage';
import storage from './utils/storage';
import { useNotification } from './hooks/useNotification';
import { ToastContainer } from 'react-toastify';
import CreateRecipePage from './pages/CreateRecipePage';
//import CreateRecipePage from './pages/CreateRecipePage';

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { showError } = useNotification();

    // // 1. Инициализация и восстановление данных
    // useEffect(() => {
    //     // Восстановление из sessionStorage
    //     const backup = sessionStorage.getItem('backupData');
    //     if (backup) {
    //         try {
    //             const { key, data } = JSON.parse(backup);
    //             storage.set(key, data);
    //         } catch (e) {
    //             showError('Ошибка восстановления данных');
    //         } finally {
    //             sessionStorage.removeItem('backupData');
    //         }
    //     }

    //     // Обработка отложенной перезагрузки
    //     const tempData = storage.get('tempData');
    //     if (tempData?.saving) {
    //         storage.remove('tempData');
    //         // Дополнительные действия при восстановлении
    //     }

    //     // Валидация критичных данных
    //     //validateCriticalData();
    // }, []);

    // // 2. Глобальный обработчик beforeunload
    // useEffect(() => {
    //     const handleBeforeUnload = () => {
    //         // Сохраняем важные данные перед закрытием/перезагрузкой
    //         const importantData = storage.get('refreshToken');
    //         if (importantData) {
    //             sessionStorage.setItem('backupData', JSON.stringify({
    //                 key: 'refreshToken',
    //                 data: importantData
    //             }));
    //         }
    //     };

    //     window.addEventListener('beforeunload', handleBeforeUnload);
    //     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    // }, []);

    // //3. Функция валидации данных
    // // const validateCriticalData = () => {
    // //     const requiredData = ['refreshToken'];
    // //     const missingData = requiredData.filter(key => !storage.get(key));

    // //     if (missingData.length > 0) {
    // //         showError(`Отсутствуют: ${missingData.join(', ')}`);
    // //         navigate('/login'); // Перенаправление если нет критичных данных
    // //     }
    // // };

    // // 4. Глобальный обработчик ошибок
    // useEffect(() => {
    //     const handleUnhandledRejection = (event) => {
    //         showError(event.reason.message || 'Неизвестная ошибка');
    //     };

    //     window.addEventListener('unhandledrejection', handleUnhandledRejection);
    //     return () => window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    // }, [showError]);

    useEffect(() => {
        dispatch(fetchCurrentUser());
    }, [dispatch]);

    return (
        <>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/register" element={<AuthPage />} />
                <Route path="/recipes/:id" element={<RecipePage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/create" element={<CreateRecipePage />} />
                </Route>
                <Route path="/users" element={<UsersPage />} />

                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collections/:collectionId" element={<CollectionDetailPage />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
}

export default App;