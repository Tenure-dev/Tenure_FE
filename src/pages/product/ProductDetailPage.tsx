import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { getMeasurementSection } from '@/features/product/lib/measurementUtils';
import { PRODUCT_STATUS_MAP, CONDITION_LABELS } from '@/features/product/lib/productAdapters';
import type { ViewerRole, ProductSaleStatus } from '@/features/product/model/types';
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
import ItemDetailHeader from './components/ProductDetailHeader';

const ProductDetailPage = () => {
  const { productId = '' } = useParams();
  return <ProductDetailPageContent key={productId} productId={productId} />;
};

const ProductDetailPageContent = ({ productId }: { productId: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [wished, setWished] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  const { data, isLoading, isError } = useProductDetail(Number(productId));
  const { mutate: markUnsold } = useDeleteProduct(Number(productId));
  const { mutate: markSoldOut } = useCompleteProductExternal(Number(productId));

  const initialToastRef = useRef((location.state as { toast?: string } | null)?.toast ?? null);
  useEffect(() => {
    if (initialToastRef.current) {
      const msg = initialToastRef.current;
      initialToastRef.current = null;
      showToast(msg);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, showToast]);

  if (isLoading) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        아이템 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const role: ViewerRole = data.viewerMode === 'SELLER' ? 'seller' : 'buyer';
  const saleStatus: ProductSaleStatus = PRODUCT_STATUS_MAP[data.productStatus];
  const showListingSections = saleStatus !== 'hidden';
  const showCTA = role === 'buyer' && saleStatus !== 'sold' && saleStatus !== 'trading';

  const seller = {
    id: String(data.seller.userId),
    nickname: data.seller.username,
    followerCount: 0,
    avatarUrl: data.seller.profileImageUrl ?? undefined,
  };

  const tenureRecord = {
    interestCount: data.item.wishCount,
    ootdVerifiedCount: data.item.ootdVerifiedWearCount,
    lastWornDate: '-',
    size: `${data.item.sizeSystem} ${data.item.sizeValue}`,
    wornFor: '-',
    category: data.item.categorySmall,
    firstOwnedDate: '-',
  };

  const conditionChecks = data.conditionFlags
    ? (Object.entries(data.conditionFlags) as [string, boolean][]).map(([key, checked]) => ({
        label: CONDITION_LABELS[key] ?? key,
        checked,
      }))
    : undefined;

  const representativeOOTDs = data.representativeOotds.map((ootd) => ({
    id: String(ootd.ootdId),
    imageUrl: ootd.imageUrl,
  }));

  const measurementSection = getMeasurementSection(
    data.item.categoryLarge,
    data.measurements ?? undefined,
  );

  const offerAvailable = data.availableActions.includes('OFFER');

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
        title: `${data.item.brandName} / ${data.item.itemName}`,
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
        onMoreClick={() => setShowMoreOptions(true)}
      />
      <ItemImageSection
        imageUrls={[data.mainImageUrl]}
        dimmed={saleStatus === 'sold'}
        wished={wished}
        onToggleWish={() => setWished((prev) => !prev)}
      >
        <ItemTitle
          brand={data.item.brandName}
          name={data.item.itemName}
          saleStatus={saleStatus}
          price={data.price ?? undefined}
        />
      </ItemImageSection>

      {showListingSections && <SellerInfoSection seller={seller} />}

      {showListingSections && data.sellerDescription && (
        <ProductDescriptionSection description={data.sellerDescription} />
      )}

      <TenureRecordSection record={tenureRecord} />

      {showListingSections && measurementSection && (
        <MeasurementSection title={measurementSection.title} fields={measurementSection.fields} />
      )}

      {showListingSections && conditionChecks && <ConditionCheckSection items={conditionChecks} />}

      <RepresentativeOOTDSection
        items={representativeOOTDs}
        onMoreClick={() => navigate(`/product/${productId}/ootds`)}
      />

      <ItemDetailCTA
        role={role}
        saleStatus={saleStatus}
        offerAvailable={offerAvailable}
        onBuy={() =>
          navigate(`/product/${productId}/purchase/checkout`, { state: { direct: true } })
        }
        onOffer={() => navigate(`/product/${productId}/purchase/price`)}
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
