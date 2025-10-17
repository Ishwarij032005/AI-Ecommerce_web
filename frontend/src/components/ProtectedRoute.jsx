import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, admin }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!token) return <Navigate to="/login" replace />;
  if (admin && !user?.isAdmin) return <Navigate to="/" replace />;
  return children;
}
