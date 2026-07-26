import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import FeedPage from '@/pages/feed/FeedPage';
import MyPage from '@/pages/mypage/MyPage';
import ProfileEditPage from '@/pages/mypage/ProfileEditPage';
import PurchaseHistoryPage from '@/pages/mypage/PurchaseHistoryPage';
import SalesHistoryPage from '@/pages/mypage/SalesHistoryPage';
import ShippingInputPage from '@/pages/mypage/ShippingInputPage';
import TradeDetailPage from '@/pages/mypage/TradeDetailPage';
import SettingsPage from '@/pages/mypage/SettingsPage';
import NotificationSettingsPage from '@/pages/mypage/NotificationSettingsPage';
import WithdrawPage from '@/pages/mypage/WithdrawPage';
import ItemDetailPage from '@/pages/item/ItemDetailPage';
import SearchHomePage from '@/pages/search/SearchHomePage';
import SearchResultPage from '@/pages/search/SearchResultPage';
import SearchSimilarOotdsPage from '@/pages/search/SearchSimilarOotdsPage';
import SearchPopularOotdsPage from '@/pages/search/SearchPopularOotdsPage';
import SearchNewOotdsPage from '@/pages/search/SearchNewOotdsPage';
import SearchPopularUsersPage from '@/pages/search/SearchPopularUsersPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import SignupPage from '@/pages/onboarding/SignupPage';
import TestPage from '@/pages/onboarding/Test';
import OotdDetailPage from '@/pages/ootd/OotdDetailPage';
import ReportPage from '@/pages/ootd/ReportPage';
import RelatedOotdPage from '@/pages/ootd/RelatedOotdPage';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';
import OotdTagPage from '@/pages/camera/OotdTagPage';
import OotdCreatePage from '@/pages/camera/OotdCreatePage';
import OotdCameraPage from '@/pages/camera/OotdCameraPage';
import OotdPreviewPage from '@/pages/camera/OotdPreviewPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <NotFoundPage />,  // TODO: NotFoundPage 추가
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'search', element: <SearchHomePage /> },
      { path: 'search/result', element: <SearchResultPage /> },
      { path: 'search/similar-ootds', element: <SearchSimilarOotdsPage /> },
      { path: 'search/popular-ootds', element: <SearchPopularOotdsPage /> },
      { path: 'search/new-ootds', element: <SearchNewOotdsPage /> },
      { path: 'search/popular-users', element: <SearchPopularUsersPage /> },
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
      { path: 'mypage/edit', element: <ProfileEditPage /> },
      { path: 'purchase-history', element: <PurchaseHistoryPage /> },
      { path: 'sales-history', element: <SalesHistoryPage /> },
      { path: 'trade/:tradeId', element: <TradeDetailPage /> },
      { path: 'trade/:tradeId/shipping', element: <ShippingInputPage /> },
      { path: 'item/:itemId', element: <ItemDetailPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'settings/notifications', element: <NotificationSettingsPage /> },
      { path: 'settings/withdraw', element: <WithdrawPage /> },
      { path: 'test', element: <TestPage /> },
      { path: 'ootd/camera', element: <OotdCameraPage /> },
      { path: 'ootd/create', element: <OotdCreatePage /> },
      { path: 'ootd/tag', element: <OotdTagPage /> },
      { path: 'ootd/preview', element: <OotdPreviewPage /> },

      { path: 'chat', element: <ChatListPage /> },
      { path: 'chat/:id', element: <ChatRoomPage /> },
      /* 채팅방 테스트용 (role × saleStatus × tradeStatus) */
      { path: 'chat/buyer', element: <ChatRoomPage role="buyer" /> },
      { path: 'chat/seller', element: <ChatRoomPage role="seller" /> },
      {
        path: 'chat/unlisted-buyer',
        element: <ChatRoomPage role="buyer" saleStatus="unlisted" tradeStatus="waiting" />,
      },
      {
        path: 'chat/unlisted-seller',
        element: <ChatRoomPage role="seller" saleStatus="unlisted" tradeStatus="waiting" />,
      },
    ],
  },
]);
