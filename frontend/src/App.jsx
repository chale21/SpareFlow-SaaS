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
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import CompanyManagement from './pages/CompanyManagement';
import UserManagement from './pages/UserManagement';

// Layout
import MainLayout from './components/layout/MainLayout';

// Authentication
import ProtectedRoute from './components/auth/ProtectedRoute';

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
                  <Dashboard />
                </MainLayout>
              }
            />

            {/* Inventory */}
            <Route
              path="/inventory"
              element={
                <MainLayout>
                  <Inventory />
                </MainLayout>
              }
            />

            {/* Categories */}
            <Route
              path="/categories"
              element={
                <MainLayout>
                  <Categories />
                </MainLayout>
              }
            />

            {/* Suppliers */}
            <Route
              path="/suppliers"
              element={
                <MainLayout>
                  <Suppliers />
                </MainLayout>
              }
            />

            {/* Purchases */}
            <Route
              path="/purchases"
              element={
                <MainLayout>
                  <Purchases />
                </MainLayout>
              }
            />

            {/* Sales */}
            <Route
              path="/sales"
              element={
                <MainLayout>
                  <Sales />
                </MainLayout>
              }
            />

            {/* Reports */}
            <Route
              path="/reports"
              element={
                <MainLayout>
                  <Reports />
                </MainLayout>
              }
            />

            {/* Notifications */}
            <Route
              path="/notifications"
              element={
                <MainLayout>
                  <Notifications />
                </MainLayout>
              }
            />

            {/* Settings */}
            <Route
              path="/settings"
              element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              }
            />

            {/* Company Management */}
            <Route
              path="/company"
              element={
                <MainLayout>
                  <CompanyManagement />
                </MainLayout>
              }
            />

            {/* User Management */}
            <Route
              path="/users"
              element={
                <MainLayout>
                  <UserManagement />
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