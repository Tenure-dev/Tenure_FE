import { Outlet, useLocation } from 'react-router-dom';
import BottomNavBar from '@/shared/components/BottomNavBar';
import { cn } from '@/shared/lib/cn';

// 하단 탭바를 숨길 경로.
// - 카메라/OOTD 등록 플로우 (촬영·게시글 작성) 및 OOTD 상세('/ootd/:id', report 포함, related만 제외)
// - 채팅방('/chat/'는 방만, 목록 '/chat'은 제외), 타인 프로필('/users/:userId')
const HIDE_NAV_PREFIXES = [
  '/ootd/camera',
  '/ootd/create',
  '/ootd/tag',
  '/ootd/preview',
  '/chat/',
  '/users/',
];
const HIDE_NAV_PATH_PATTERN = /^\/ootd\/\d+(\/report)?$/;

const RootLayout = () => {
  const { pathname } = useLocation();
  const hideNav =
    HIDE_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
    HIDE_NAV_PATH_PATTERN.test(pathname);

  return (
    <div className="bg-bg-white flex min-h-screen justify-center">
      <div
        className={cn(
          'bg-bg-white min-h-screen w-full max-w-[768px] min-w-[320px]',
          !hideNav && 'pb-28',
        )}
      >
        <Outlet />
        {!hideNav && <BottomNavBar />}
      </div>
    </div>
  );
};

export default RootLayout;
