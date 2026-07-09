import { createBrowserRouter } from 'react-router-dom';
import FeedPage from '@/pages/home/FeedPage';
import MyPage from '@/pages/mypage/MyPage';
import PurchaseHistoryPage from '@/pages/mypage/PurchaseHistoryPage';
import SalesHistoryPage from '@/pages/mypage/SalesHistoryPage';
import ShippingInputPage from '@/pages/mypage/ShippingInputPage';
import TradeDetailPage from '@/pages/mypage/TradeDetailPage';
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
      { path: 'purchase-history', element: <PurchaseHistoryPage /> },
      { path: 'sales-history', element: <SalesHistoryPage /> },
      { path: 'trade/:tradeId', element: <TradeDetailPage /> },
      { path: 'trade/:tradeId/shipping', element: <ShippingInputPage /> },
    ],
  },
]);
