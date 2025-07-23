import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, adminOrStaff = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Si requiere ser admin y el usuario no es admin
    return <Navigate to={user.role === 'staff' ? '/admin' : '/dashboard'} replace />;
  }

  if (adminOrStaff && user.role !== 'admin' && user.role !== 'staff') {
    // Si requiere ser admin o staff y el usuario no es ninguno de los dos
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;