import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute - Prevents unauthenticated users from accessing protected pages
 * Redirects to /login if no token is found in localStorage
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

/**
 * PublicOnlyRoute - Prevents authenticated users from accessing login/register pages
 * Redirects to /dashboard if a token is found in localStorage
 */

export const PublicOnlyRoute = ({ children }: PublicOnlyProps) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

interface PublicOnlyProps {
  children: ReactNode;
}
