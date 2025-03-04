import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();

  if (!authenticated) {
    // Redirect para a pagina de login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;