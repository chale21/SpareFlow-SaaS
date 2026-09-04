import React from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';

// ============================================================
// AUTH
// ============================================================

import {
  AuthProvider,
} from './context/AuthContext';

import ProtectedRoute from './components/auth/ProtectedRoute';

// ============================================================
// LAYOUT
// ============================================================

import MainLayout from './components/layout/MainLayout';

// ============================================================
// PUBLIC PAGES
// ============================================================

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// ============================================================
// PROTECTED PAGES
// ============================================================

import Dashboard from './pages/Dashboard';

import Inventory from './pages/Inventory';

import ProductDetails from './pages/ProductDetails';

import Categories from './pages/Categories';

import Suppliers from './pages/Suppliers';

import Purchases from './pages/Purchases';

import Sales from './pages/Sales';

import Reports from './pages/Reports';

import Notifications from './pages/Notifications';

import Settings from './pages/Settings';

import CompanyManagement from './pages/CompanyManagement';

import UserManagement from './pages/UserManagement';

// ============================================================
// APP
// ============================================================

function App() {

  return (

    <AuthProvider>

      <Router>

        <Routes>

          {/* ==================================================
              PUBLIC ROUTES
          ================================================== */}

          <Route
            path="/"
            element={
              <LandingPage />
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage />
            }
          />

          <Route
            path="/register"
            element={
              <RegisterPage />
            }
          />

          {/* ==================================================
              PROTECTED ROUTES
          ================================================== */}

          <Route
            element={
              <ProtectedRoute />
            }
          >

            {/* =================================================
                DASHBOARD
            ================================================= */}

            <Route
              path="/dashboard"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />

            {/* =================================================
                INVENTORY
            ================================================= */}

            <Route
              path="/inventory"
              element={
                <MainLayout>
                  <Inventory />
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
                  <ProductDetails />
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
                  <Categories />
                </MainLayout>
              }
            />

            {/* =================================================
                SUPPLIERS
            ================================================= */}

            <Route
              path="/suppliers"
              element={
                <MainLayout>
                  <Suppliers />
                </MainLayout>
              }
            />

            {/* =================================================
                PURCHASES
            ================================================= */}

            <Route
              path="/purchases"
              element={
                <MainLayout>
                  <Purchases />
                </MainLayout>
              }
            />

            {/* =================================================
                SALES
            ================================================= */}

            <Route
              path="/sales"
              element={
                <MainLayout>
                  <Sales />
                </MainLayout>
              }
            />

            {/* =================================================
                REPORTS
            ================================================= */}

            <Route
              path="/reports"
              element={
                <MainLayout>
                  <Reports />
                </MainLayout>
              }
            />

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <Route
              path="/notifications"
              element={
                <MainLayout>
                  <Notifications />
                </MainLayout>
              }
            />

            {/* =================================================
                SETTINGS
            ================================================= */}

            <Route
              path="/settings"
              element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              }
            />

            {/* =================================================
                COMPANY MANAGEMENT
            ================================================= */}

            <Route
              path="/company"
              element={
                <MainLayout>
                  <CompanyManagement />
                </MainLayout>
              }
            />

            {/* =================================================
                USER MANAGEMENT
            ================================================= */}

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