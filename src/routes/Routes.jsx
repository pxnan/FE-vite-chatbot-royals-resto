import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from '../pages/user/UserPage';
import AdminPage from '../pages/admin/AdminPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={ <UserPage /> } />
            <Route path="/admin" element={ <AdminPage /> } />
        </Routes>
    </Router>
);

export default AppRoutes;
