import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected pages
import Dashboard from './pages/Dashboard';

import Inventory from './pages/Inventory';

import ProductDetails from './pages/ProductDetails';

import Categories from './pages/Categories';

import Suppliers from './pages/Suppliers';

import Purchases from './pages/Purchases';

import Sales from './pages/Sales';
import SalesHistory from './pages/SalesHistory';
import Invoice from './pages/Invoice';
import Reports from './pages/Reports';


import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import CompanyManagement from './pages/CompanyManagement';
import UserManagement from './pages/UserManagement';
import AdminCompanies from './pages/admin/Companies';
import StockMovements from './pages/StockMovements';

// Layout
import MainLayout from './components/layout/MainLayout';

// Authentication
import ProtectedRoute from './components/auth/ProtectedRoute';
import PermissionRoute from './components/auth/PermissionRoute';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>

          {/* =====================================================
              PUBLIC ROUTES
          ===================================================== */}

          <Route
            path="/"
            element={<LandingPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />


          {/* =====================================================
              PROTECTED ROUTES
          ===================================================== */}

          <Route element={<ProtectedRoute />}>

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <PermissionRoute permission="dashboard.view"><Dashboard /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Inventory */}
            <Route
              path="/inventory"
              element={
                <MainLayout>
                  <PermissionRoute anyPermission={['inventory.view', 'products.view']}><Inventory /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* =================================================
                PRODUCT DETAILS
            ================================================= */}

            <Route
              path="/inventory/:id"
              element={
                <MainLayout>
                  <PermissionRoute anyPermission={['inventory.view', 'products.view']}><ProductDetails /></PermissionRoute>
                </MainLayout>
              }
            />

            <Route
              path="/stock-movements"
              element={
                <MainLayout>
                  <PermissionRoute permission="stockMovements.view"><StockMovements /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* =================================================
                CATEGORIES
            ================================================= */}

            <Route
              path="/categories"
              element={
                <MainLayout>
                  <PermissionRoute permission="categories.view"><Categories /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Suppliers */}
            <Route
              path="/suppliers"
              element={
                <MainLayout>
                  <PermissionRoute permission="suppliers.view"><Suppliers /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Purchases */}
            <Route
              path="/purchases"
              element={
                <MainLayout>
                  <PermissionRoute permission="purchases.view"><Purchases /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Sales */}
            <Route
              path="/sales"
              element={
                <MainLayout>
                  <PermissionRoute anyPermission={['sales.view', 'sales.create']}><Sales /></PermissionRoute>
                </MainLayout>
              }
            />

            <Route
              path="/sales/history"
              element={
                <MainLayout>
                  <PermissionRoute permission="sales.view"><SalesHistory /></PermissionRoute>
                </MainLayout>
              }
            />

            <Route
              path="/sales/:id/invoice"
              element={
                <MainLayout>
                  <PermissionRoute permission="sales.view"><Invoice /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Reports */}
            <Route
              path="/reports"
              element={
                <MainLayout>
                  <PermissionRoute permission="reports.view"><Reports /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Notifications */}
            <Route
              path="/notifications"
              element={
                <MainLayout>
                  <PermissionRoute permission="notifications.view"><Notifications /></PermissionRoute>
                </MainLayout>
              }
            />

            <Route
              path="/admin/companies"
              element={
                <MainLayout>
                  <PermissionRoute role="SUPER_ADMIN"><AdminCompanies /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <MainLayout>
                  <PermissionRoute roles={['SHOP_OWNER', 'SUPER_ADMIN']}><Settings /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* Company Management */}
            <Route
              path="/company"
              element={
                <MainLayout>
                  <PermissionRoute roles={['SHOP_OWNER', 'SUPER_ADMIN']}><CompanyManagement /></PermissionRoute>
                </MainLayout>
              }
            />

            {/* User Management */}
            <Route
              path="/users"
              element={
                <MainLayout>
                  <PermissionRoute permission="staff.view"><UserManagement /></PermissionRoute>
                </MainLayout>
              }
            />

          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;