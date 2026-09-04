import React from 'react';

const PlatformSettings = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Platform Settings</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">General Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input type="text" defaultValue="SpareFlow" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input type="email" defaultValue="support@spareflow.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Subscription Plans</h2>
          <div className="text-gray-500 text-sm">Configure pricing tiers and plan features here.</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Security</h2>
          <div className="text-gray-500 text-sm">Password policies, session timeouts, and rate limits.</div>
        </div>

        <div className="flex justify-end">
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
