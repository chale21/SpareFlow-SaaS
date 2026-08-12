import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import useAuth from '../hooks/useAuth';

/**
 * RegisterPage providing a professional company registration experience for SpareFlow.
 */
const RegisterPage = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (formData) => {
    clearError();
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    }
    return result;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 className="mt-2 text-center text-2xl font-bold text-slate-100">
          Register Your Company Workspace
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl border border-slate-100 sm:px-10">
          <RegisterForm
            onSubmit={handleRegisterSubmit}
            isLoading={isLoading}
            externalError={error}
          />

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link to="/" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;