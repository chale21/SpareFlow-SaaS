import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Reusable hook to consume application AuthContext.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
