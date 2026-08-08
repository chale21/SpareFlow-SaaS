import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SpareFlow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Smart Inventory Management System for Spare Parts Shops
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Start Free Trial
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;