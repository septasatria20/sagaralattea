import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminDashboardPage from './pages/AdminDashboardPage';
import HomePage from './pages/HomePage';
import MitraDashboardPage from './pages/MitraDashboardPage';

const root = createRoot(document.getElementById('app'));
const pageData = window.__INITIAL_PAGE_DATA__ ?? {};
const page = pageData.page ?? 'home';
const PageComponent = page === 'admin-dashboard'
    ? AdminDashboardPage
    : page === 'mitra-dashboard'
        ? MitraDashboardPage
        : HomePage;

root.render(
    <React.StrictMode>
        <PageComponent data={pageData} />
    </React.StrictMode>,
);
