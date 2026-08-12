import React from 'react';

const Notifications = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Notifications</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Your Notifications</h2>
            <p className="text-sm text-gray-500">Low stock alerts, system updates, and business activity.</p>
          </div>
          <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Mark All as Read
          </button>
        </div>

        <div className="space-y-3">
          <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-lg">
            No notifications at this time.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
