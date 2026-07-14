import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { MOCK_ITEM_DETAILS } from '@/features/item/model/mock';
import type { ViewerRole } from '@/features/item/model/types';
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
} from '@/features/item/ui';
import ItemDetailHeader from './components/ItemDetailHeader';

const ItemDetailPage = () => {
  const { itemId = '' } = useParams();
  return <ItemDetailPageContent key={itemId} itemId={itemId} />;
};

const ItemDetailPageContent = ({ itemId }: { itemId: string }) => {
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const item = MOCK_ITEM_DETAILS[itemId];
  const [wished, setWished] = useState(item?.isWished ?? false);
  const [isBlocked, setIsBlocked] = useState(false);

  // 바텀 시트
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // 공용 Toast가 머지되면 그걸로 교체
  const showToast = (message: string) => console.log(message);

  if (!item) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        아이템 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const role: ViewerRole = currentUserId === item.sellerId ? 'seller' : 'buyer';
  const showListingSections = item.saleStatus !== 'unsold';
  const showCTA = role === 'buyer' && item.saleStatus !== 'soldOut';

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
        title: `${item.brand} / ${item.name}`,
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
        imageUrls={item.imageUrls}
        dimmed={item.saleStatus === 'soldOut'}
        wished={wished}
        onToggleWish={() => setWished((prev) => !prev)}
      >
        <ItemTitle
          brand={item.brand}
          name={item.name}
          saleStatus={item.saleStatus}
          price={item.price}
        />
      </ItemImageSection>

      {showListingSections && <SellerInfoSection seller={item.seller} />}

      {showListingSections && item.description && (
        <ProductDescriptionSection description={item.description} />
      )}

      <TenureRecordSection record={item.tenureRecord} />
      {showListingSections && item.measurements && (
        <MeasurementSection
          title={item.measurementTitle ?? '실측 입력'}
          fields={item.measurements}
        />
      )}
      {showListingSections && item.conditionChecks && (
        <ConditionCheckSection items={item.conditionChecks} />
      )}
      <RepresentativeOOTDSection items={item.representativeOOTDs} />

      <ItemDetailCTA
        role={role}
        saleStatus={item.saleStatus}
        offerAvailable={item.offerAvailable}
      />

      {/* 더보기 버튼 바텀 시트 */}
      <ItemMoreOptionsSheet
        open={showMoreOptions}
        onClose={() => setShowMoreOptions(false)}
        role={role}
        isBlocked={isBlocked}
        onToggleBlock={setIsBlocked}
        onToast={showToast}
      />

      {/* 공유하기 버튼 바텀 시트 */}
      <ItemShareSheet
        open={showShareOptions}
        onClose={() => setShowShareOptions(false)}
        onCopyLink={handleCopyLink}
        onShareToApp={handleShareToApp}
      />
    </div>
  );
};

export default ItemDetailPage;
