import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loader from './Loader';
const AdminRoute = ({ children }) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background dark:bg-dark-navy">
        <Loader size="xl" color="primary" className="mb-4" />
        <span className="text-on-surface-variant dark:text-on-surface-variant font-medium">Loading...</span>
      </div>
    );
  }

  if (!user || (profile?.role !== 'super_admin' && profile?.role !== 'expert')) {
    return <Navigate to="/dashboard" replace />;
  }

  if (profile?.requires_password_change && location.pathname !== '/force-password-change') {
    return <Navigate to="/force-password-change" replace />;
  }

  return children;
};

export default AdminRoute;
