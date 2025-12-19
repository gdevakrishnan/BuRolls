import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';

// roles: array of allowed roles, e.g., ['SUPER_ADMIN']
const ProtectedRoute = ({ roles }) => {
  const { isAuthenticated, user } = useContext(AppContext);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0) {
    if (!user || !roles.includes(user.role)) return <Navigate to="/not-authorized" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;