import React from 'react';

const SystemLogs = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">System Logs</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Audit & Activity Logs</h2>
            <p className="text-sm text-gray-500">Track platform-wide system events and user actions.</p>
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All Types</option>
              <option>Login</option>
              <option>Error</option>
              <option>Admin Action</option>
            </select>
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors">
              Export
            </button>
          </div>
        </div>

        <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-lg">
          No system logs available yet.
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
