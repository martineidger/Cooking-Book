import React from 'react';
import { Outlet } from 'react-router-dom';
//import Footer from './components/Footer';  // Импортируйте ваш компонент Footer
import Header from '../components/Header';

const Layout = () => {
    return (
        <div className="layout">
            <Header /> {/* Ваш хедер */}
            <main>
                <Outlet /> {/* Здесь будет рендериться контент, соответствующий маршруту */}
            </main>
            {/* <Footer /> Ваш футер */}
        </div>
    );
};

export default Layout;
