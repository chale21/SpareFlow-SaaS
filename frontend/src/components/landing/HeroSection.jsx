import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-[400px] w-[400px] rounded-full bg-slate-100/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[680px] items-center gap-14 py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">

          {/* ================= LEFT CONTENT ================= */}
          <div className="max-w-2xl">

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Take control of your
              <span className="block text-emerald-600">
                spare parts inventory.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              SpareFlow helps spare parts businesses manage inventory,
              purchases, sales, suppliers, and stock levels from one
              simple and powerful platform.
            </p>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl"
              >
                Start Free
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50"
              >
                See How It Works
              </a>

            </div>

            {/* Trust message */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Easy to get started
              </div>

              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Secure & multi-tenant
              </div>
            </div>
          </div>

          {/* ================= RIGHT PRODUCT VISUAL ================= */}
          <div className="relative mx-auto w-full max-w-xl lg:mx-0">

            {/* Glow */}
            <div className="absolute inset-10 rounded-full bg-blue-200/40 blur-3xl" />

            {/* Main Dashboard */}
            <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">

              {/* Browser Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                </div>

                <div className="rounded-md bg-slate-50 px-3 py-1 text-[10px] font-medium text-slate-400">
                  spareflow
                </div>

              </div>

              {/* Dashboard */}
              <div className="bg-slate-50 p-4 sm:p-5">

                {/* Dashboard Header */}
                <div className="mb-5 flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                      Overview
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Business Dashboard
                    </h3>
                  </div>

                  <div className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
                    This month
                  </div>

                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-medium text-slate-500">
                      Products
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      1,248
                    </p>
                    <p className="mt-1 text-[9px] font-semibold text-emerald-600">
                      +8.4%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-medium text-slate-500">
                      Sales
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      $24.8K
                    </p>
                    <p className="mt-1 text-[9px] font-semibold text-emerald-600">
                      +12.5%
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-medium text-slate-500">
                      Purchases
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      $9.4K
                    </p>
                    <p className="mt-1 text-[9px] font-semibold text-blue-600">
                      86 orders
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-[10px] font-medium text-slate-500">
                      Low Stock
                    </p>
                    <p className="mt-1 text-lg font-bold text-amber-600">
                      12
                    </p>
                    <p className="mt-1 text-[9px] font-semibold text-amber-600">
                      Needs attention
                    </p>
                  </div>

                </div>

                {/* Chart + Alert */}
                <div className="mt-4 grid gap-4 sm:grid-cols-[1.5fr_1fr]">

                  {/* Chart */}
                  <div className="rounded-xl border border-slate-200 bg-white p-4">

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-700">
                          Sales Overview
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          Revenue performance
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-emerald-600">
                        +18.2%
                      </span>
                    </div>

                    {/* Fake chart */}
                    <div className="mt-5 flex h-28 items-end gap-2">

                      {[35, 48, 42, 65, 54, 72, 86, 68, 92, 78, 96, 88].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 rounded-t-md bg-emerald-500/80 transition-all"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}

                    </div>

                    <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                      <span>Jan</span>
                      <span>Jun</span>
                      <span>Dec</span>
                    </div>

                  </div>

                  {/* Low Stock Alert */}
                  <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                        <svg
                          className="h-4 w-4 text-amber-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Stock Alert
                        </p>
                        <p className="text-[9px] text-slate-500">
                          12 items need attention
                        </p>
                      </div>

                    </div>

                    <div className="mt-4 space-y-2">

                      <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                        <span className="text-[10px] font-medium text-slate-700">
                          Brake Pads
                        </span>
                        <span className="text-[10px] font-bold text-amber-600">
                          4 left
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                        <span className="text-[10px] font-medium text-slate-700">
                          Engine Oil
                        </span>
                        <span className="text-[10px] font-bold text-amber-600">
                          6 left
                        </span>
                      </div>

                      <div className="flex items-center justify-between rounded-lg bg-white/70 px-3 py-2">
                        <span className="text-[10px] font-medium text-slate-700">
                          Car Battery
                        </span>
                        <span className="text-[10px] font-bold text-amber-600">
                          3 left
                        </span>
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -right-4 top-20 hidden w-52 rounded-xl border border-slate-200 bg-white p-3 shadow-xl sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <svg
                    className="h-5 w-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Sale completed
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Inventory updated automatically
                  </p>
                </div>

              </div>

            </div>

            {/* Floating inventory card */}
            <div className="absolute -bottom-5 -left-5 hidden w-48 rounded-xl border border-slate-200 bg-white p-3 shadow-xl sm:block">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-medium text-slate-500">
                    Inventory Value
                  </p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    $84.6K
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M5 6h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"
                    />
                  </svg>
                </div>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Bottom Value Strip */}
      <div className="relative border-t border-slate-100 bg-slate-50/70">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">

          

          


         

        </div>
      </div>

    </section>
  );
};

export default HeroSection;