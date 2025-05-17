// // // src/api/http.js
// // import axios from 'axios';
// // import { authApi } from './authApi';

// // const http = axios.create({
// //     baseURL: 'http://localhost:3000',
// // });

// // http.interceptors.request.use(config => {
// //     const token = authApi.getAccessToken();
// //     if (token) {
// //         config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// // });

// // http.interceptors.response.use(
// //     response => response,
// //     async error => {
// //         const originalRequest = error.config;

// //         if (error.response?.status === 401 && !originalRequest._retry) {
// //             originalRequest._retry = true;

// //             try {
// //                 await authApi.refreshTokens();
// //                 return http(originalRequest);
// //             } catch (refreshError) {
// //                 authApi.clearAuthData();
// //                 window.location.href = '/login';
// //                 return Promise.reject(refreshError);
// //             }
// //         }

// //         return Promise.reject(error);
// //     }
// // );

// // export default http;

// // src/api/http.js
// import axios from 'axios';
// import { authApi } from './authApi';
// import { toast } from 'react-toastify';

// const http = axios.create({
//     baseURL: 'http://localhost:3000',
// });

// http.interceptors.request.use(config => {
//     const token = authApi.getAccessToken();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// http.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             try {
//                 await authApi.refreshTokens();
//                 return http(originalRequest);
//             } catch (refreshError) {
//                 // Очищаем данные аутентификации
//                 authApi.clearAuthData();

//                 // Показываем уведомление вместо перенаправления
//                 showAuthNotification({
//                     message: 'Ваша сессия истекла. Пожалуйста, войдите снова.',
//                     type: 'error',
//                     duration: 5000
//                 });

//                 return Promise.reject(refreshError);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// const showAuthNotification = ({ message, type = 'info', duration = 3000 }) => {
//     toast[type](message, {
//         position: "bottom-right",
//         autoClose: duration,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//     });
// };

// export default http;


// src/api/http.js
import axios from 'axios';
import { authApi } from './authApi';
import { toast } from 'react-toastify';
import { useNotification } from '../hooks/useNotification';

const { showError } = useNotification();

const http = axios.create({
    baseURL: 'http://localhost:3000',
});

// Добавляем токен только если пользователь авторизован
http.interceptors.request.use(config => {
    const token = authApi.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Обрабатываем только 401 ошибки для авторизованных пользователей
        if (error.response?.status === 401) {
            console.log("REFRESH ENTER")
            // Если это первый раз и мы еще не пытались обновить токен
            if (!originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    await authApi.refreshTokens();
                    console.log("REFRESH SEND")
                    return http(originalRequest);
                } catch (refreshError) {
                    // Если не удалось обновить токен - разлогиниваем
                    //authApi.clearAuthData();
                    //showError("")
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

export default http;