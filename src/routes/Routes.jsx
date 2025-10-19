import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from '../pages/user/UserPage';
import AdminPage from '../pages/admin/AdminPage';
import NotFoundPage from '../pages/notFound/NotFoundPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={ <UserPage /> } />
            <Route path="/admin" element={ <AdminPage /> } />
            <Route path="*" element={ <NotFoundPage /> } />
        </Routes>
    </Router>
);

export default AppRoutes;
