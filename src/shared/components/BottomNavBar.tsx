import { Link, useLocation } from 'react-router-dom';
import {
  feedActive,
  feedInactive,
  searchActive,
  searchInactive,
  cameraInactive,
  chatActive,
  chatInactive,
  myActive,
  myInactive,
} from '@/shared/assets/nav-bar';

type NavItem = {
  path: string;
  activeIcon: string;
  inactiveIcon: string;
  activeWhen: (pathname: string) => boolean;
};

const LEFT_ITEMS: NavItem[] = [
  {
    path: '/feed',
    activeIcon: feedActive,
    inactiveIcon: feedInactive,
    activeWhen: (p) => p === '/' || p.startsWith('/feed'),
  },
  {
    path: '/search',
    activeIcon: searchActive,
    inactiveIcon: searchInactive,
    activeWhen: (p) => p.startsWith('/search'),
  },
];

const RIGHT_ITEMS: NavItem[] = [
  {
    path: '/chat',
    activeIcon: chatActive,
    inactiveIcon: chatInactive,
    activeWhen: (p) => p.startsWith('/chat'),
  },
  {
    path: '/mypage',
    activeIcon: myActive,
    inactiveIcon: myInactive,
    activeWhen: (p) => p.startsWith('/mypage'),
  },
];

const HIDDEN_PATHS = [
  '/login',
  '/signup',
  '/test',
  '/trade',
  '/search',
  '/mypage/edit',
  '/mypage/items',
];

const NavLink = ({ item, pathname }: { item: NavItem; pathname: string }) => {
  const isActive = item.activeWhen(pathname);
  return (
    <Link
      to={item.path}
      className="flex flex-1 items-center justify-center p-2 transition-transform active:scale-90"
    >
      <img
        src={isActive ? item.activeIcon : item.inactiveIcon}
        alt={item.path.slice(1)}
        className="size-6"
      />
    </Link>
  );
};

const BottomNavBar = () => {
  const { pathname } = useLocation();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[calc(100vw-3rem)] max-w-[calc(768px-3rem)] -translate-x-1/2">
      <div className="flex h-13 items-center rounded-full border border-white/50 bg-white/25 px-2 shadow-xl backdrop-blur-md">
        {LEFT_ITEMS.map((item) => (
          <NavLink key={item.path} item={item} pathname={pathname} />
        ))}

        <Link
          to="/camera"
          className="bg-bg-black flex size-13 flex-shrink-0 items-center justify-center rounded-full shadow-md transition-transform active:scale-95"
        >
          <img src={cameraInactive} alt="camera" className="size-6" />
        </Link>

        {RIGHT_ITEMS.map((item) => (
          <NavLink key={item.path} item={item} pathname={pathname} />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;
