import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { store } from './store/store.js'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';
import { fetchCurrentUser } from './store/slices/authSlice.js'

// Проверяем аутентификацию при загрузке приложения
if (localStorage.getItem('accessToken')) {
  store.dispatch(fetchCurrentUser());
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
)