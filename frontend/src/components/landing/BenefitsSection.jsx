
import React from 'react';

const BenefitsSection = () => {
  const benefits = [
    {
      title: 'Eliminate Manual Record Keeping',
      description:
        'Stop relying on paper notebooks, messy Excel spreadsheets, or memory. Every transaction is digitally logged.',
    },
    {
      title: 'Prevent Stock Shortages & Overstocking',
      description:
        'Automated minimum stock alerts notify you before popular spare parts run out, avoiding lost sales opportunities.',
    },
    {
      title: 'Organize Sales & Supplier Purchases',
      description:
        'Keep exact records of incoming shipments from suppliers and outgoing customer invoices in one system.',
    },
    {
      title: 'Instant Part & Category Lookup',
      description:
        'Quickly find replacement parts by code, name, category, or supplier without searching warehouse shelves.',
    },
    {
      title: 'Real-Time Business Visibility',
      description:
        'Monitor daily sales revenue, stock valuation, and employee activities anytime from any web browser.',
    },
  ];

  return (
    <section
      id="benefits"
      className="relative overflow-hidden bg-white py-20 sm:py-24 border-b border-slate-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* =====================================================
              LEFT SIDE — BENEFITS
          ====================================================== */}
          <div>
            

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Built to Make
              <span className="block text-emerald-600">
                Inventory Management Easier
              </span>
            </h2>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed">
              SpareFlow was developed specifically to address the day-to-day
              challenges faced by spare parts shops, mechanics suppliers, and
              auto parts retailers.
            </p>

            {/* Benefits List */}
            <div className="mt-9 space-y-4">
              {benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all duration-300"
                >
                  {/* Number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <span className="text-sm font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Benefit Content */}
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-slate-900">
                      {benefit.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Highlight */}
            <div className="mt-7 flex items-center gap-3 text-sm font-medium text-slate-500">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-xs text-emerald-700">
                  ✓
                </div>

                <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-600">
                  ✓
                </div>

                <div className="w-7 h-7 rounded-full bg-emerald-50 border-2 border-white flex items-center justify-center text-xs text-emerald-700">
                  ✓
                </div>
              </div>

              <span>
                Designed for faster, smarter spare parts operations
              </span>
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE — SPARE PARTS IMAGE
          ====================================================== */}
          <div className="relative">

            {/* Decorative Background */}
            <div className="absolute -inset-4 bg-emerald-50 rounded-[2rem] -z-10"></div>

            {/* Main Image */}
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-slate-100">

              <img
                src="src/assets/images/spare-parts-warehouse.jpg"
                alt="Organized automotive spare parts warehouse"
                className="w-full h-[620px] sm:h-[680px] object-cover"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
            </div>

            {/* =================================================
                FLOATING INVENTORY STATUS CARD
            ================================================== */}
            <div className="absolute -bottom-6 -left-5 sm:-left-8 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 sm:p-5 w-[230px] sm:w-[260px]">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Inventory Status
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-slate-900">
                    Well Organized
                  </p>
                </div>

                {/* Check Icon */}
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
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
                </div>
              </div>

              {/* Progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">
                    Stock visibility
                  </span>

                  <span className="font-bold text-emerald-600">
                    98%
                  </span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* =================================================
                TOP RIGHT STOCK TRACKING CARD
            ================================================== */}
            <div className="absolute -top-5 -right-4 sm:-right-6 bg-white border border-slate-200 shadow-lg rounded-xl px-4 py-3">

              <div className="flex items-center gap-3">

                {/* Box Icon */}
                <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0v10l-8 4m8-14l-8 4m0 10L4 17V7m8 14V11m0 0L4 7"
                    />
                  </svg>
                </div>

                {/* Card Text */}
                <div>
                  <p className="text-xs text-slate-500">
                    Stock tracking
                  </p>

                  <p className="text-sm font-bold text-slate-900">
                    Real-time
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
