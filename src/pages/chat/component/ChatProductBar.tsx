import { Button } from '@/shared/components';
import type { ChatProduct, ChatRole, SaleStatus, TradeStatus } from '@/features/chat/model/types';

const formatPrice = (n: number) => `${n.toLocaleString()}원`;

const ChatActions = ({
  role,
  saleStatus,
  tradeStatus,
}: {
  role: ChatRole;
  saleStatus: SaleStatus;
  tradeStatus: TradeStatus;
}) => {
  // 거래 생성 이후(생성~완료): 3번째 버튼 '거래 상세', 판매 전환 비활성
  const tradeStarted = tradeStatus === 'created' || tradeStatus === 'done';

  // 판매자
  if (role === 'seller') {
    return (
      <div className="flex gap-2">
        <Button variant="solid" size="36" className="text-body-2 w-full! flex-1">
          상품 관리
        </Button>
        <Button
          variant="solid"
          size="36"
          disabled={tradeStarted}
          className="text-body-2 w-full! flex-1"
        >
          판매 전환
        </Button>
        <Button variant="solid" size="36" className="text-body-2 w-full! flex-1">
          {tradeStarted ? '거래 상세' : '제안 확인'}
        </Button>
      </div>
    );
  }

  // 구매자 — 거래 단계에 따라 오른쪽 버튼 전환
  let right: { label: string; filled?: boolean };
  if (tradeStarted) {
    right = { label: '거래 상세' };
  } else if (tradeStatus === 'waiting') {
    right = { label: '보낸 요청 보기' };
  } else {
    // none: 판매중이면 바로 구매, 미판매면 요청부터
    right =
      saleStatus === 'onSale' ? { label: '구매하기', filled: true } : { label: '보낸 요청 보기' };
  }

  return (
    <div className="flex gap-2">
      <Button variant="solid" size="36" className="text-body-2 w-full! flex-1">
        상품 상세
      </Button>
      <Button
        variant={right.filled ? 'filled' : 'solid'}
        size="36"
        className={right.filled ? 'text-body-2 w-full! flex-1' : 'text-body-2 w-full! flex-1'}
      >
        {right.label}
      </Button>
    </div>
  );
};

const ChatProductBar = ({
  product,
  role,
  saleStatus = 'onSale',
  tradeStatus = 'none',
}: {
  product: ChatProduct;
  role: ChatRole;
  saleStatus?: SaleStatus;
  tradeStatus?: TradeStatus;
}) => (
  <div className="border-border-secondary flex flex-col gap-4 border-b px-5 py-2">
    <div className="flex items-center gap-2">
      <img
        src={product.thumbnail}
        alt={product.brand}
        className="size-14 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0">
        <p className="text-body-2 truncate font-semibold">{product.brand}</p>
        {saleStatus === 'unlisted' ? (
          <>
            <p className="text-body-3 text-text-secondary">미판매 상품</p>
            <p className="text-body-3 text-text-secondary">
              제안 금액 :{' '}
              <span className="text-error font-semibold">{formatPrice(product.price)}</span>
            </p>
          </>
        ) : (
          <>
            <p className="text-body-2 text-error font-semibold">{formatPrice(product.price)}</p>
            <p className="text-body-3 text-text-secondary">{product.status}</p>
          </>
        )}
      </div>
    </div>
    <ChatActions role={role} saleStatus={saleStatus} tradeStatus={tradeStatus} />
  </div>
);

export default ChatProductBar;
