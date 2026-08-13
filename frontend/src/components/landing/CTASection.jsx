import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CTA Section component for final conversion push
 * at the bottom of the landing page.
 */
const CTASection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24 border-t border-slate-200">

      {/* =====================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      {/* Emerald Glow - Top Right */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px]
        bg-emerald-100 rounded-full blur-[120px] opacity-70
        pointer-events-none"
      />

      {/* Soft Slate Glow - Bottom Left */}
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px]
        bg-slate-200 rounded-full blur-[120px] opacity-60
        pointer-events-none"
      />

      {/* Center Glow */}
      <div
        className="absolute top-1/2 left-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[600px] h-[300px]
        bg-emerald-50 rounded-full blur-[130px]
        opacity-80 pointer-events-none"
      />

      {/* =====================================================
          SUBTLE GRID PATTERN
      ====================================================== */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

       

        {/* =================================================
            HEADING
        ================================================== */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">

          Ready to Simplify Your

          <span className="block text-emerald-600 mt-1">
            Spare Parts Business?
          </span>

        </h2>

        {/* Description */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Bring inventory tracking, supplier purchases, customer sales, and
          business insights together with{' '}
          <span className="font-semibold text-slate-900">
            SpareFlow
          </span>
          .
        </p>

        {/* =================================================
            BUTTONS
        ================================================== */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          {/* Primary Button */}
          <Link
            to="/register"
            className="
              w-full sm:w-auto
              px-8 py-4
              bg-emerald-600
              hover:bg-emerald-700
              text-white
              font-bold
              rounded-xl
              shadow-lg shadow-emerald-600/20
              transition-all duration-300
              text-base
              hover:-translate-y-1
              hover:shadow-xl hover:shadow-emerald-600/25
              text-center
            "
          >
            Create Your Account
          </Link>

          {/* Secondary Button */}
          <Link
            to="/login"
            className="
              w-full sm:w-auto
              px-8 py-4
              bg-white
              hover:bg-slate-50
              text-slate-700
              font-semibold
              rounded-xl
              border border-slate-300
              shadow-sm
              transition-all duration-300
              text-base
              hover:-translate-y-1
              hover:shadow-md
              text-center
            "
          >
            Sign In to Existing Account
          </Link>

        </div>

        {/* =================================================
            SUPPORTING TEXT
        ================================================== */}
        <div className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-500">

          <svg
            className="w-4 h-4 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>

          <span>
            Simple inventory management. Better business decisions.
          </span>

        </div>

        {/* =================================================
            TRUST INDICATORS
        ================================================== */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-slate-400">

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Inventory Tracking
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sales Management
          </div>

          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Supplier Management
          </div>

        </div>

      </div>
    </section>
  );
};

export default CTASection;