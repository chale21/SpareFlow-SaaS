import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer component for SpareFlow Landing Page.
 * Multi-column layout with product navigation, account links, and copyright info.
 */
const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              {/* Logo Icon */}
              <div className="relative w-9 h-9 flex items-center justify-center">
                {/* Background */}
                <div className="absolute inset-0 rounded-xl bg-emerald-600 rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
            
                {/* Icon */}
                <div className="relative w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Gear */}
                    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
                    <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.46 15a1.7 1.7 0 0 0-1.56-1.03H6.7v-2.4h.2A1.7 1.7 0 0 0 8.46 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.73 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.2v2.4h-.2A1.7 1.7 0 0 0 19.4 15Z" />
                  </svg>
                </div>
              </div>
            
              {/* Brand Name */}
              <span className="text-xl font-extrabold tracking-tight text-white">
                Spare<span className="text-emerald-600">Flow</span>
              </span>
            </Link>
            
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Cloud-based Multi-Tenant Spare Parts & Inventory Management SaaS designed to streamline inventory tracking, purchases, sales, and analytics for spare parts shops.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Data Security</a></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register Company</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SpareFlow. All rights reserved.</p>
          <p className="text-slate-400">Multi-Tenant SaaS Inventory Management System</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
