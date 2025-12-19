import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';

const PublicRoute = () => {
  const { isAuthenticated, user } = useContext(AppContext);
  if (isAuthenticated) {
    // redirect to role dashboard
    if (user?.role === 'SUPER_ADMIN') return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'BU_MANAGER') return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default PublicRoute;