import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, profile } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect them to the /signin page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If the user is an admin, they should not be accessing client protected routes
  // Redirect them to the admin dashboard
  if (profile?.role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  } else if (profile?.role === 'expert') {
    return <Navigate to="/admin/requirements" replace />;
  }

  return children;
};

export default ProtectedRoute;
