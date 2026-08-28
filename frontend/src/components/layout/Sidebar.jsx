import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiLayers,
  FiTruck,
  FiShoppingCart,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiBriefcase 
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FiGrid,
    },
    {
      path: '/inventory',
      label: 'Inventory',
      icon: FiPackage,
    },
    {
      path: '/categories',
      label: 'Categories',
      icon: FiLayers,
    },
    {
      path: '/suppliers',
      label: 'Suppliers',
      icon: FiTruck,
    },
    {
      path: '/purchases',
      label: 'Purchases',
      icon: FiShoppingCart,
    },
    {
      path: '/sales',
      label: 'Sales',
      icon: FiDollarSign,
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: FiBarChart2,
    },
    {
  path: '/company',
  label: 'Company',
  icon: FiBriefcase,
},
{
  path: '/users',
  label: 'Users',
  icon: FiBriefcase,
},
    {
  path: '/notifications',
  label: 'Notifications',
  icon: FiBell,
},
    {
      path: '/settings',
      label: 'Settings',
      icon: FiSettings,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[2px] lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static
          inset-y-0 left-0
          z-50
          w-60
          shrink-0
          bg-white
          border-r border-slate-200
          flex flex-col
          shadow-sm lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* ================= LOGO ================= */}
        <div className="h-20 px-5 flex items-center border-b border-slate-100">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 group"
          >
            {/* Logo Icon */}
            <div className="relative w-9 h-9 shrink-0">
              <div
                className="
                  absolute inset-0
                  rounded-xl
                  bg-emerald-500
                  rotate-3
                  opacity-20
                  group-hover:rotate-6
                  transition-transform duration-300
                "
              />

              <div
                className="
                  relative
                  w-9 h-9
                  rounded-xl
                  bg-emerald-600
                  flex items-center justify-center
                  shadow-sm
                  group-hover:bg-emerald-700
                  transition-colors duration-200
                "
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />

                  <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.73 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z" />
                </svg>
              </div>
            </div>

            {/* Brand */}
            <div className="leading-none">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Spare<span className="text-emerald-600">Flow</span>
              </span>

              <p className="mt-1 text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                Inventory Management
              </p>
            </div>
          </Link>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {/* Section title */}
          <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Main Menu
          </p>

          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `
                      group
                      relative
                      flex items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-lg
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? `
                            bg-emerald-50
                            text-emerald-700
                            shadow-sm
                          `
                          : `
                            text-slate-600
                            hover:bg-slate-50
                            hover:text-slate-900
                          `
                      }
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator */}
                        {isActive && (
                          <span
                            className="
                              absolute
                              left-0
                              top-1/2
                              -translate-y-1/2
                              w-0.5
                              h-6
                              rounded-r-full
                              bg-emerald-600
                            "
                          />
                        )}

                        {/* Icon */}
                        <span
                          className={`
                            flex
                            items-center
                            justify-center
                            w-8
                            h-8
                            rounded-md
                            transition-colors
                            duration-200
                            ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'text-slate-400 group-hover:text-slate-600'
                            }
                          `}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </span>

                        {/* Label */}
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div
            className="
              rounded-lg
              bg-slate-50
              border border-slate-100
              px-3
              py-3
            "
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-600">
                SpareFlow SaaS
              </p>

              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-emerald-50
                  px-2
                  py-0.5
                  text-[9px]
                  font-semibold
                  text-emerald-600
                "
              >
              </span>
            </div>

            <p className="mt-1 text-[10px] text-slate-400">
              Inventory Management Platform
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;