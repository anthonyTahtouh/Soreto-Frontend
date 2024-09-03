import React, { useContext } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import LoginService from '../services/LoginService';
import StoreContext from '../store/Context';

const ProtectedRoutes = ({ allowedRoles }: any) => {
  const { isAuthenticated, isAuthLoading } = useContext(StoreContext);

  if (isAuthLoading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoutes;
