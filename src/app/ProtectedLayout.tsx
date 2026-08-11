import { Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN_STORAGE_KEY, clearAuthStorage, isTokenExpired } from '@/shared/lib/api';

const ProtectedLayout = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (!token || isTokenExpired(token)) {
    if (token) clearAuthStorage();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
