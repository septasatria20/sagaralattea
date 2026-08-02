import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MitraDashboardPage from './pages/MitraDashboardPage';
import POSPage from './pages/POSPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';
import CustomerOrderPage from './pages/CustomerOrderPage';

const root = createRoot(document.getElementById('app'));
const pageData = window.__INITIAL_PAGE_DATA__ ?? {};
const page = pageData.page ?? 'home';
const PageComponent = page === 'admin-dashboard'
    ? AdminDashboardPage
    : page === 'login'
        ? LoginPage
    : page === 'mitra-dashboard'
        ? MitraDashboardPage
    : page === 'pos-dashboard'
        ? POSPage
    : page === 'customer-order'
        ? CustomerOrderPage
    : page === 'investor-dashboard'
        ? InvestorDashboardPage
        : HomePage;

root.render(
    <React.StrictMode>
        <PageComponent data={pageData} />
    </React.StrictMode>,
);
