import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getNavigationForRole } from '../../config/navigationConfig';
import useAuth from '../../hooks/useAuth';

import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const { user } = useAuth();

const navigationItems = getNavigationForRole(
  user?.role
);

  const pageTitles = {
    '/dashboard': 'Dashboard',
    '/inventory': 'Inventory',
    '/categories': 'Categories',
    '/suppliers': 'Suppliers',
    '/purchases': 'Purchases',
    '/sales': 'Sales',
    '/reports': 'Reports',
    '/settings': 'Settings',
  };

  const currentPage =
    pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Reusable Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Reusable Navbar */}
        <Navbar
          pageTitle={currentPage}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
};

export default MainLayout;