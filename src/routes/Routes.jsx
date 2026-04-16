import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from '../pages/user/UserPage';
import AdminPage from '../pages/admin/AdminPage';
import NotFoundPage from '../pages/notFound/NotFoundPage';
import AdminLatihModel from '../pages/admin/AdminLatihModel';
import InputPertanyaan from '../pages/admin/InputPertanyaan';
import KelolaAdmin from '../pages/admin/KelolaAdmin';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={ <UserPage /> } />
            <Route path="/admin" element={ <AdminPage /> } />
            <Route path="/admin/latih-model" element={ <AdminLatihModel /> } />
            <Route path="/admin/input-pertanyaan" element={ <InputPertanyaan /> } />
            <Route path="/admin/kelola-admin" element={ <KelolaAdmin /> } />
            <Route path="*" element={ <NotFoundPage /> } />
        </Routes>
    </Router>
);

export default AppRoutes;
