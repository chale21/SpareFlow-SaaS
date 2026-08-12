import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import StockMovements from './pages/StockMovements';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

import AdminDashboard from './pages/admin/AdminDashboard';
import Companies from './pages/admin/Companies';
import Users from './pages/admin/Users';
import SystemLogs from './pages/admin/SystemLogs';
import PlatformSettings from './pages/admin/PlatformSettings';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = localStorage.getItem('token');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout><Dashboard /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <MainLayout><Inventory /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <MainLayout><Categories /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <MainLayout><Suppliers /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <MainLayout><Purchases /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <MainLayout><Sales /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stock-movements"
          element={
            <ProtectedRoute>
              <MainLayout><StockMovements /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <MainLayout><Reports /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <MainLayout><Notifications /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout><Settings /></MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminLayout><Companies /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminLayout><Users /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/system-logs"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminLayout><SystemLogs /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
              <AdminLayout><PlatformSettings /></AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
