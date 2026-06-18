import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
// Đã ẩn import DashboardLayout vì mình không dùng luồng này nữa
// import DashboardLayout from './layouts/DashboardLayout'; 
import PredictLink from './pages/PredictLink'; 
import PredictTop5 from './pages/PredictTop5';
import Interactions from './pages/Interactions';
import History from './pages/History';
import Dictionary from './pages/Dictionary';
import Profile from './pages/Profile';

// Thêm Component của Admin
import AdminDashboard from './pages/AdminDashboard';
import AdminManagement from './pages/AdminManagement';
import AdminPermissions from './pages/AdminPermissions';
import AdminSettings from './pages/AdminSettings';
import AdminReports from './pages/AdminReports';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/profile" element={<Profile />} />

        {/* Khung User - Đã gỡ bỏ bọc DashboardLayout để full màn hình */}
        <Route path="/dashboard" element={<Navigate to="/dashboard/predict-single" replace />} />
        <Route path="/dashboard/predict-single" element={<PredictLink />} />
        <Route path="/dashboard/predict-top5" element={<PredictTop5 />} />
        <Route path="/dashboard/interactions" element={<Interactions />} />
        <Route path="/dashboard/history" element={<History />} />

        {/* Luồng Admin riêng biệt */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminManagement />} />
        <Route path="/admin/permissions" element={<AdminPermissions />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;