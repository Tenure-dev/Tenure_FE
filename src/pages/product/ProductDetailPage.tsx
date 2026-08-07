import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { buildProductDetailViewModel } from './lib/buildProductDetailViewModel';
import {
  ItemImageSection,
  ItemTitle,
  SellerInfoSection,
  ProductDescriptionSection,
  TenureRecordSection,
  MeasurementSection,
  ConditionCheckSection,
  RepresentativeOOTDSection,
  ItemDetailCTA,
  ItemMoreOptionsSheet,
  ItemShareSheet,
} from '@/features/product/ui';
import { useProductDetail } from '@/features/product/model/useProductDetail';
import { useDeleteProduct } from '@/features/product/model/useDeleteProduct';
import { useCompleteProductExternal } from '@/features/product/model/useCompleteProductExternal';
import { useToggleWish } from '@/features/wishlist/model/useToggleWish';
import { createOrGetChatRoom } from '@/features/chat/api/room';
import { useItemDetailQuery } from '@/features/mypage/model/useItemDetailQuery';
import { useItemOotdCandidatesQuery } from '@/features/mypage/model/useItemOotdCandidatesQuery';
import { useUserStore } from '@/store/userStore';
import ItemDetailHeader from './components/ProductDetailHeader';

const ProductDetailPage = () => {
  const { productId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const itemIdFromQuery = Number(searchParams.get('itemId') ?? 0);
  const key = productId || String(itemIdFromQuery);
  return (
    <ProductDetailPageContent key={key} productId={productId} itemIdFromQuery={itemIdFromQuery} />
  );
};

const ProductDetailPageContent = ({
  productId,
  itemIdFromQuery,
}: {
  productId: string;
  itemIdFromQuery: number;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUserId = useUserStore((s) => s.user?.userId);

  const [isBlocked, setIsBlocked] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  // productId가 유효한 양의 정수인 경우에만 product API 사용 아니면 item API 사용
  const productIdNum = productId !== '' ? Number(productId) : NaN;
  const hasProductId = !isNaN(productIdNum) && productIdNum > 0;

  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useProductDetail(productIdNum);

  // productStatus가 HIDDEN이면 item mode로 전환
  const isHiddenProduct = hasProductId && productData?.productStatus === 'HIDDEN';
  const isItemMode = !hasProductId || isHiddenProduct;

  // item mode에서 사용할 itemId: HIDDEN 상품이면 product 응답의 item.itemId, 아니면 query string
  const itemIdForItemMode = isHiddenProduct ? (productData?.item.itemId ?? 0) : itemIdFromQuery;

  // item mode에서 item API 호출
  const {
    data: itemData,
    isLoading: itemLoading,
    isError: itemError,
  } = useItemDetailQuery(itemIdForItemMode, { enabled: isItemMode && itemIdForItemMode > 0 });
  const { data: taggedOotdsData } = useItemOotdCandidatesQuery(
    itemIdForItemMode,
    { size: 3 },
    { enabled: isItemMode && itemIdForItemMode > 0 },
  );

  // more options에서 판매 상태 변경
  const { mutate: markUnsold } = useDeleteProduct(productIdNum);
  const { mutate: markSoldOut } = useCompleteProductExternal(productIdNum);

  // 위시
  const wishItemId = isItemMode ? itemData?.itemId : productData?.item.itemId;
  const wishInitial = isItemMode
    ? (itemData?.wished ?? false)
    : (productData?.item.wished ?? false);
  const { wished, toggle: toggleWish } = useToggleWish(wishItemId, wishInitial);

  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);
  useEffect(() => {
    if (initialToastRef.current) {
      const msg = initialToastRef.current;
      initialToastRef.current = null;
      showToast(msg);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, showToast]);

  const isLoading = hasProductId ? productLoading || (isHiddenProduct && itemLoading) : itemLoading;

  const isError = hasProductId ? productError || (isHiddenProduct && itemError) : itemError;

  if (isLoading) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (isError || (isItemMode && !itemData) || (!isItemMode && !productData)) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        아이템 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // product mode와 item mode를 통합한 view model 생성
  const {
    role,
    saleStatus,
    brandName,
    itemName,
    price,
    imageUrl,
    tenureRecord,
    offerAvailable,
    conditionChecks,
    measurementSection,
    seller,
    sellerDescription,
    ootdItems,
  } = buildProductDetailViewModel({
    isItemMode,
    itemData,
    productData,
    taggedOotdsData,
    currentUserId,
  });

  const showListingSections = saleStatus !== 'hidden';
  const showCTA = role === 'buyer' && saleStatus !== 'sold' && saleStatus !== 'trading';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('링크가 복사되었습니다.');
    } catch (error) {
      console.error(error);
      showToast('링크 복사에 실패했습니다.');
    }
  };

  const handleShareToApp = async () => {
    if (!navigator.share) {
      console.warn('이 브라우저는 공유하기를 지원하지 않습니다.');
      return;
    }
    try {
      await navigator.share({
        title: `${brandName} / ${itemName}`,
        url: window.location.href,
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error(error);
      }
    }
  };

  return (
    <div className={`bg-bg-white flex min-h-screen flex-col ${showCTA ? 'pb-[86px]' : ''}`}>
      <ItemDetailHeader
        onShareClick={() => setShowShareOptions(true)}
        onMoreClick={isItemMode && role === 'seller' ? undefined : () => setShowMoreOptions(true)}
      />
      <ItemImageSection
        imageUrls={[imageUrl]}
        dimmed={saleStatus === 'sold'}
        wished={wished}
        onToggleWish={toggleWish}
      >
        <ItemTitle brand={brandName} name={itemName} saleStatus={saleStatus} price={price} />
      </ItemImageSection>

      {showListingSections && seller && <SellerInfoSection seller={seller} />}

      {showListingSections && sellerDescription && (
        <ProductDescriptionSection description={sellerDescription} />
      )}

      <TenureRecordSection record={tenureRecord} />

      {showListingSections && measurementSection && (
        <MeasurementSection title={measurementSection.title} fields={measurementSection.fields} />
      )}

      {showListingSections && conditionChecks && <ConditionCheckSection items={conditionChecks} />}

      <RepresentativeOOTDSection
        title={isItemMode ? '태그된 OOTD' : '대표 OOTD'}
        items={ootdItems}
        onMoreClick={
          isItemMode
            ? () => navigate(`/items/${itemIdForItemMode}/ootds`)
            : () => navigate(`/product/${productId}/ootds`)
        }
      />

      <ItemDetailCTA
        role={role}
        saleStatus={saleStatus}
        offerAvailable={offerAvailable}
        onBuy={() =>
          navigate(`/product/${productId}/purchase/checkout`, { state: { direct: true } })
        }
        onOffer={() => navigate(`/product/${wishItemId}/offer/price`)}
        onChat={async () => {
          if (!productData) return;
          const { chatRoomId } = await createOrGetChatRoom(productData.item.itemId);
          navigate(`/chat/${chatRoomId}`);
        }}
      />

      {/* 추가기능 - 바텀시트, 토스트 */}
      <ItemMoreOptionsSheet
        open={showMoreOptions}
        onClose={() => setShowMoreOptions(false)}
        role={role}
        isBlocked={isBlocked}
        onToggleBlock={setIsBlocked}
        onEdit={() => navigate(`/product/${productId}/edit`)}
        onReport={() => navigate(`/product/${productId}/report`)}
        onMarkUnsold={() =>
          markUnsold(undefined, { onSuccess: () => showToast('미판매로 변경되었습니다.') })
        }
        onMarkSoldOut={() =>
          markSoldOut(undefined, { onSuccess: () => showToast('판매 완료로 변경되었습니다.') })
        }
        onToast={showToast}
      />

      <ItemShareSheet
        open={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        onCopyLink={handleCopyLink}
        onShareToApp={handleShareToApp}
      />

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default ProductDetailPage;
