import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import FeedPage from '@/pages/feed/FeedPage';
import MyPage from '@/pages/mypage/MyPage';
import SettingsPage from '@/pages/mypage/SettingsPage';
import SearchPage from '@/pages/search/SearchPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import SignupPage from '@/pages/onboarding/SignupPage';
import TestPage from '@/pages/onboarding/Test';
import OotdDetailPage from '@/pages/ootd/OotdDetailPage';
import ReportPage from '@/pages/ootd/ReportPage';
import RelatedOotdPage from '@/pages/ootd/RelatedOotdPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <NotFoundPage />,  // TODO: NotFoundPage 추가
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'ootd/:id', element: <OotdDetailPage /> },
      { path: 'ootd/:id/report', element: <ReportPage /> },
      { path: 'ootd/:id/related', element: <RelatedOotdPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      // 비로그인 전용 (PublicOnlyLayout)
      // { element: <PublicOnlyLayout />, children: [
      //   { path: 'login', element: <LoginPage /> },
      // ]},
      // 로그인 필요 (ProtectedLayout)
      { path: 'mypage', element: <MyPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'test', element: <TestPage /> },
    ],
  },
]);
