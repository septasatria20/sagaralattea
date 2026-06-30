import React from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './pages/HomePage';

const root = createRoot(document.getElementById('app'));
const pageData = window.__INITIAL_PAGE_DATA__ ?? {};

root.render(
    <React.StrictMode>
        <HomePage data={pageData} />
    </React.StrictMode>,
);
