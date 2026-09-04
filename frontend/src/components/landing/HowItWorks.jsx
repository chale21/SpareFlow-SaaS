import React from 'react';

/**
 * 3-Step How It Works section component.
 */
const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Business Account',
      description: 'Register your company profile on the SpareFlow platform to get an isolated secure workspace.',
    },
    {
      number: '02',
      title: 'Add Products & Suppliers',
      description: 'Catalog your spare parts inventory with category classifications, prices, SKUs, and supplier contacts.',
    },
    {
      number: '03',
      title: 'Manage Stock, Purchases & Sales',
      description: 'Record incoming supplier shipments and customer sales with real-time stock updates and invoice generation.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get Started in Three Simple Steps
          </h2>
          <p className="mt-4 text-base text-slate-600 font-normal">
            Effortless onboarding designed so shop owners and staff can start managing inventory immediately.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs relative flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black text-emerald-600 font-mono tracking-wider block mb-4">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{step.description}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300 font-bold text-xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
