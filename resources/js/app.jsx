import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MitraDashboardPage from './pages/MitraDashboardPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';

const root = createRoot(document.getElementById('app'));
const pageData = window.__INITIAL_PAGE_DATA__ ?? {};
const page = pageData.page ?? 'home';
const PageComponent = page === 'admin-dashboard'
    ? AdminDashboardPage
    : page === 'login'
        ? LoginPage
    : page === 'mitra-dashboard'
        ? MitraDashboardPage
        : page === 'investor-dashboard'
            ? InvestorDashboardPage
        : HomePage;

root.render(
    <React.StrictMode>
        <PageComponent data={pageData} />
    </React.StrictMode>,
);
