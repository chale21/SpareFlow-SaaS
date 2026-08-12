import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Platform Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Total Companies', value: '0', color: 'bg-blue-500' },
          { label: 'Total Users', value: '0', color: 'bg-green-500' },
          { label: 'Active Subscriptions', value: '0', color: 'bg-purple-500' },
          { label: 'Platform Revenue', value: '$0', color: 'bg-orange-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl`}>
                📊
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h2>
          <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg">
            No recent activity.
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">New Companies</h2>
          <div className="text-center text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-lg">
            No companies registered yet.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
