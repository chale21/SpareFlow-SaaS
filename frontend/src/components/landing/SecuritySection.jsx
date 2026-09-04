import React from 'react';

/**
 * Security & Multi-Tenant Data Isolation section focusing on business privacy and access control.
 */
const SecuritySection = () => {
  const securityFeatures = [
    {
      title: 'Dedicated Company Workspaces',
      description: 'Every registered company receives an independent workspace. Your inventory, suppliers, sales, and financial records are strictly isolated.',
      icon: (
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Role-Based User Permissions',
      description: 'Assign specific responsibilities to staff members. Restrict access so staff perform daily operational tasks while owners retain administrative control.',
      icon: (
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: 'Audit Trail & Movement Tracking',
      description: 'Track every stock adjustment, purchase, and completed sale with clear audit logs for accountability across your team.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="security" className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Your Business Data Stays Organized and Isolated
          </h2>
          <p className="mt-4 text-base text-slate-300 font-normal">
            SpareFlow utilizes a modern multi-tenant SaaS architecture to guarantee that your company data remains isolated and protected.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
          {securityFeatures.map((feat) => (
            <div key={feat.title} className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/70 hover:border-blue-500/50 transition-all">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shrink-0 w-fit mb-4">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
