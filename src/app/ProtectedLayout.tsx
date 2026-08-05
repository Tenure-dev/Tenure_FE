import { Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/shared/lib/api';

const ProtectedLayout = () => {
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
