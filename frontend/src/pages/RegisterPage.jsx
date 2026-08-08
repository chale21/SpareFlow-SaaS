import React from 'react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register Company</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Company Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter company name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Owner Name</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter owner name" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input type="password" className="w-full px-3 py-2 border rounded-lg" placeholder="Enter your password" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;