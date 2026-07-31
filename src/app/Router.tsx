import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import FeedPage from '@/pages/feed/FeedPage';
import NotificationPage from '@/pages/feed/NotificationPage';
import MyPage from '@/pages/mypage/MyPage';
import WishListPage from '@/pages/mypage/WishListPage';
import ProfileEditPage from '@/pages/mypage/ProfileEditPage';
import PurchaseHistoryPage from '@/pages/mypage/PurchaseHistoryPage';
import SalesHistoryPage from '@/pages/mypage/SalesHistoryPage';
import ShippingInputPage from '@/pages/mypage/ShippingInputPage';
import TradeDetailPage from '@/pages/mypage/TradeDetailPage';
import RegisteredItemsPage from '@/pages/mypage/RegisteredItemsPage';
import ItemAddPage from '@/pages/mypage/ItemAddPage';
import ItemDetailPage from '@/pages/mypage/ItemDetailPage';
import SaleConversionPage from '@/pages/mypage/SaleConversionPage';
import SettingsPage from '@/pages/mypage/SettingsPage';
import NotificationSettingsPage from '@/pages/mypage/NotificationSettingsPage';
import AccountVisibilityPage from '@/pages/mypage/AccountVisibilityPage';
import WithdrawPage from '@/pages/mypage/WithdrawPage';
import ProductDetailPage from '@/pages/product/ProductDetailPage';
import ProductEditPage from '@/pages/product/ProductEditPage';
import ProductReportPage from '@/pages/product/ProductReportPage';
import OotdGridPage from '@/pages/product/OotdGridPage';
import SearchHomePage from '@/pages/search/SearchHomePage';
import SearchResultPage from '@/pages/search/SearchResultPage';
import SearchSimilarOotdsPage from '@/pages/search/SearchSimilarOotdsPage';
import SearchPopularOotdsPage from '@/pages/search/SearchPopularOotdsPage';
import SearchNewOotdsPage from '@/pages/search/SearchNewOotdsPage';
import SearchPopularUsersPage from '@/pages/search/SearchPopularUsersPage';
import LoginPage from '@/pages/onboarding/LoginPage';
import SignupPage from '@/pages/onboarding/SignupPage';
import FindPasswordPage from '@/pages/onboarding/FindPasswordPage';
import TestPage from '@/pages/onboarding/Test';
import ProtectedLayout from './ProtectedLayout';
import OotdDetailPage from '@/pages/ootd/OotdDetailPage';
import ReportPage from '@/pages/ootd/ReportPage';
import RelatedOotdPage from '@/pages/ootd/RelatedOotdPage';
import ChatListPage from '@/pages/chat/ChatListPage';
import ChatRoomPage from '@/pages/chat/ChatRoomPage';
import PricePage from '@/pages/purchase/PricePage';
import CheckoutPage from '@/pages/purchase/CheckoutPage';
import ProcessingPage from '@/pages/purchase/ProcessingPage';
import OfferDetailPage from '@/pages/purchase/OfferDetailPage';
import IntentDetailPage from '@/pages/purchase/IntentDetailPage';
import OotdTagPage from '@/pages/camera/OotdTagPage';
import OotdCreatePage from '@/pages/camera/OotdCreatePage';
import OotdCameraPage from '@/pages/camera/OotdCameraPage';
import OotdPreviewPage from '@/pages/camera/OotdPreviewPage';
import UserProfilePage from '@/pages/user/UserProfilePage';
import ReceivedOffersPage from '@/pages/offer/ReceivedOffersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    // errorElement: <NotFoundPage />,  // TODO: NotFoundPage 추가
    children: [
      // 비로그인 공개 라우트
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'find-password', element: <FindPasswordPage /> },

      // 로그인 필요 라우트
      {
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <FeedPage /> },
          { path: 'feed', element: <FeedPage /> },
          { path: 'notifications', element: <NotificationPage /> },
          { path: 'search', element: <SearchHomePage /> },
          { path: 'search/result', element: <SearchResultPage /> },
          { path: 'search/similar-ootds', element: <SearchSimilarOotdsPage /> },
          { path: 'search/popular-ootds', element: <SearchPopularOotdsPage /> },
          { path: 'search/new-ootds', element: <SearchNewOotdsPage /> },
          { path: 'search/popular-users', element: <SearchPopularUsersPage /> },
          { path: 'ootd/:id', element: <OotdDetailPage /> },
          { path: 'ootd/:id/report', element: <ReportPage /> },
          { path: 'ootd/:id/related', element: <RelatedOotdPage /> },
          { path: 'mypage', element: <MyPage /> },
          { path: 'wishlist', element: <WishListPage /> },
          { path: 'mypage/edit', element: <ProfileEditPage /> },
          { path: 'mypage/items', element: <RegisteredItemsPage /> },
          { path: 'mypage/items/new', element: <ItemAddPage /> },
          { path: 'items/:itemId', element: <ItemDetailPage /> },
          { path: 'items/:itemId/sell', element: <SaleConversionPage /> },
          { path: 'users/:userId', element: <UserProfilePage /> },
          { path: 'purchase-history', element: <PurchaseHistoryPage /> },
          { path: 'sales-history', element: <SalesHistoryPage /> },
          { path: 'purchase/offer/:offerId', element: <OfferDetailPage /> },
          { path: 'purchase/intent/:intentId', element: <IntentDetailPage /> },
          { path: 'items/:itemId/offers', element: <ReceivedOffersPage /> },
          { path: 'trade/:tradeId', element: <TradeDetailPage /> },
          { path: 'trade/:tradeId/shipping', element: <ShippingInputPage /> },
          { path: 'product/:productId', element: <ProductDetailPage /> },
          { path: 'product/:productId/ootds', element: <OotdGridPage /> },
          { path: 'product/:productId/edit', element: <ProductEditPage /> },
          { path: 'product/:productId/report', element: <ProductReportPage /> },
          { path: 'product/:productId/purchase/price', element: <PricePage /> },
          { path: 'product/:productId/purchase/checkout', element: <CheckoutPage /> },
          { path: 'product/:productId/purchase/processing', element: <ProcessingPage /> },
          { path: 'settings', element: <SettingsPage /> },
          { path: 'settings/notifications', element: <NotificationSettingsPage /> },
          { path: 'settings/visibility', element: <AccountVisibilityPage /> },
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
          {
            // 미판매 + 구매제안X (판매자) → '제안 확인' 비활성
            path: 'chat/unlisted-no-offer',
            element: (
              <ChatRoomPage
                role="seller"
                saleStatus="unlisted"
                tradeStatus="none"
                offerEnabled={false}
              />
            ),
          },
        ],
      },
    ],
  },
]);
