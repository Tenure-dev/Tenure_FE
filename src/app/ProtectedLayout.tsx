import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { ACCESS_TOKEN_STORAGE_KEY, clearAuthStorage, isTokenExpired } from '@/shared/lib/api';
import { useUserStore } from '@/store/userStore';
import { useMyInfo } from '@/features/auth/model/useMyInfo';

const ProtectedLayout = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);

  // 토큰은 유효한데 store가 비어있는 경우(새로고침/웹뷰 재시작 등으로 인메모리 상태가 날아간 경우) 재조회한다.
  const { data: myInfo, isLoading } = useMyInfo(!!token && !isTokenExpired(token) && !user);

  useEffect(() => {
    if (myInfo) setUser(myInfo);
  }, [myInfo, setUser]);

  if (!token || isTokenExpired(token)) {
    if (token) clearAuthStorage();
    return <Navigate to="/login" replace />;
  }

  if (!user && isLoading) {
    return (
      <div className="bg-bg-white flex min-h-screen items-center justify-center">
        <span className="text-body-3 text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedLayout;
