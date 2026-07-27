import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router의 SPA 네비게이션(pushState)은 실제 페이지 로드가 아니라서
// 브라우저가 스크롤을 자동으로 맨 위로 리셋해주지 않는다. 페이지 전환마다 직접 리셋한다.
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
};
