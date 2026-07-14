import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import FeedPage from '@/pages/feed/FeedPage';
import MyPage from '@/pages/mypage/MyPage';
import PurchaseHistoryPage from '@/pages/mypage/PurchaseHistoryPage';
import SalesHistoryPage from '@/pages/mypage/SalesHistoryPage';
import ShippingInputPage from '@/pages/mypage/ShippingInputPage';
import TradeDetailPage from '@/pages/mypage/TradeDetailPage';
import SettingsPage from '@/pages/mypage/SettingsPage';
import ItemDetailPage from '@/pages/item/ItemDetailPage';
import SearchPage from '@/pages/search/SearchPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import SignupPage from '@/pages/onboarding/SignupPage';
import TestPage from '@/pages/onboarding/Test';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <NotFoundPage />,  // TODO: NotFoundPage 추가
    children: [
      { index: true, element: <FeedPage /> },
      { path: 'feed', element: <FeedPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      // 비로그인 전용 (PublicOnlyLayout)
      // { element: <PublicOnlyLayout />, children: [
      //   { path: 'login', element: <LoginPage /> },
      // ]},
      // 로그인 필요 (ProtectedLayout)
      { path: 'mypage', element: <MyPage /> },
      { path: 'purchase-history', element: <PurchaseHistoryPage /> },
      { path: 'sales-history', element: <SalesHistoryPage /> },
      { path: 'trade/:tradeId', element: <TradeDetailPage /> },
      { path: 'trade/:tradeId/shipping', element: <ShippingInputPage /> },
      { path: 'item/:itemId', element: <ItemDetailPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'test', element: <TestPage /> },

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
