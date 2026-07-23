import { Outlet, useLocation } from 'react-router-dom';
import BottomNavBar from '@/shared/components/BottomNavBar';
import { cn } from '@/shared/lib/cn';

// 하단 탭바를 숨길 경로 (카메라/OOTD 등록 플로우), 촬영 및 게시글 작성에서는 navbar를 숨기도록 하였습니다.
const HIDE_NAV_PATHS = ['/ootd/camera', '/ootd/create', '/ootd/tag', '/ootd/preview'];

// 동적 경로라 prefix로 판단. '/chat/'는 채팅방만 잡고 목록('/chat')은 제외된다.
const HIDE_NAV_PREFIXES = ['/chat/'];

const RootLayout = () => {
  const { pathname } = useLocation();
  const hideNav =
    HIDE_NAV_PATHS.includes(pathname) ||
    HIDE_NAV_PREFIXES.some((prefix) => pathname.startsWith(prefix));

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
