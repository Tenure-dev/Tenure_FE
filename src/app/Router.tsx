import { createBrowserRouter } from 'react-router-dom';
import FeedPage from '@/pages/home/FeedPage';
import MyPage from '@/pages/mypage/MyPage';
import SearchPage from '@/pages/search/SearchPage';

export const router = createBrowserRouter([
  {
    path: '/',
    // element: <RootLayout />,   // TODO: RootLayout 추가
    // errorElement: <NotFoundPage />,  // TODO: NotFoundPage 추가
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'search', element: <SearchPage /> },
      // 비로그인 전용 (PublicOnlyLayout)
      // { element: <PublicOnlyLayout />, children: [
      //   { path: 'login', element: <LoginPage /> },
      // ]},
      // 로그인 필요 (ProtectedLayout)
      { path: 'mypage', element: <MyPage /> },
    ],
  },
]);
