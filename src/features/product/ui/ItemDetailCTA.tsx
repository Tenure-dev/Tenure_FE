import { Button, DoubleButton } from '@/shared/components';
import type { ProductSaleStatus, ViewerRole } from '../model/types';

export interface ItemDetailCTAProps {
  role: ViewerRole;
  saleStatus: ProductSaleStatus;
  offerAvailable?: boolean;
  onChat?: () => void;
  onBuy?: () => void;
  onOffer?: () => void;
}

const ItemDetailCTA = ({
  role,
  saleStatus,
  offerAvailable,
  onChat,
  onBuy,
  onOffer,
}: ItemDetailCTAProps) => {
  if (role !== 'buyer' || saleStatus === 'sold' || saleStatus === 'trading') {
    return null;
  }

  return (
    <div className="bg-bg-white fixed bottom-0 left-1/2 w-full max-w-[768px] min-w-[320px] -translate-x-1/2 px-4 py-3 md:px-6">
      {saleStatus === 'onSale' ? (
        <DoubleButton
          layout="half"
          leftLabel="채팅하기"
          rightLabel="구매하기"
          onLeftClick={() => onChat?.()}
          onRightClick={() => onBuy?.()}
        />
      ) : (
        <Button
          variant="filled"
          size="54"
          className="!w-full"
          disabled={!offerAvailable}
          onClick={() => onOffer?.()}
        >
          구매제안하기
        </Button>
      )}
    </div>
  );
};

export default ItemDetailCTA;
