import React from 'react';

/**
 * Business Flow Section component visually illustrating the lifecycle of spare parts inventory in SpareFlow.
 */
const BusinessFlow = () => {
  const nodes = [
    { name: 'Products Catalog', type: 'Input', desc: 'Define Categories & SKUs', color: 'bg-blue-600 text-white' },
    { name: 'Purchases (Stock In)', type: 'Process', desc: 'Receive Supplier Goods', color: 'bg-indigo-600 text-white' },
    { name: 'Central Inventory', type: 'Core', desc: 'Real-Time Stock Auditing', color: 'bg-slate-900 text-white' },
    { name: 'Sales (Stock Out)', type: 'Process', desc: 'Deduct Quantities & Invoices', color: 'bg-emerald-600 text-white' },
    { name: 'Reports & Analytics', type: 'Output', desc: 'Financial Insights', color: 'bg-purple-600 text-white' },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Seamless Inventory Lifecycle Flow
          </h2>
          <p className="mt-4 text-base text-slate-600 font-normal">
            SpareFlow connects every operational step so every purchase and sale automatically maintains inventory precision.
          </p>
        </div>

        {/* Horizontal Visual Flow Container */}
        <div className="mt-14 max-w-5xl mx-auto bg-slate-50 p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-2">
            {nodes.map((node, idx) => (
              <React.Fragment key={node.name}>
                <div className="w-full lg:w-48 p-4 rounded-xl shadow-sm bg-white border border-slate-200 flex flex-col items-center text-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${node.color}`}>
                    {node.type}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{node.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{node.desc}</p>
                </div>

                {idx < nodes.length - 1 && (
                  <div className="text-slate-400 font-bold text-lg my-1 lg:my-0">
                    <span className="hidden lg:inline">→</span>
                    <span className="inline lg:hidden">↓</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessFlow;
