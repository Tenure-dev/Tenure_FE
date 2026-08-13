import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button, DoubleButton } from '@/shared/components';
import { ApiError } from '@/shared/lib/api';
import { useTradeDetail } from '@/features/trade/api/useTradeDetail';
import { useTradeStatusChange } from '@/features/trade/api/useTradeStatusChange';
import type { TradeStatus } from '@/features/trade/api/types';
import { buildTradeTimeline } from '@/features/trade/lib/buildTradeTimeline';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { createOrGetChatRoomByTrade } from '@/features/chat/api/room';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="px-[16px] pt-[24px] pb-[8px] text-[12px] text-[#767676]">{children}</p>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] text-[#767676]">{label}</span>
    <span className="text-[13px] text-[#111111]">{value}</span>
  </div>
);

const formatPrice = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const TRADE_STATUS_LABEL: Record<TradeStatus, string> = {
  PAID: '결제 완료',
  SHIPPED: '배송 준비중',
  DELIVERED: '배송 완료',
  PURCHASE_CONFIRMED: '구매 확정',
  SETTLED: '정산 완료',
  COMPLETED: '거래 완료',
  TRANSFERRED: '거래 완료',
};

// BE TradeAction enum(com.tenure.domain.trade.enums.TradeAction)과 값이 일치해야 한다.
const ACTION_REGISTER_SHIPMENT = 'REGISTER_SHIPMENT';
const ACTION_MARK_DELIVERED = 'MARK_DELIVERED';
const ACTION_CONFIRM_PURCHASE = 'CONFIRM_PURCHASE';

const MessageScreen = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col bg-[#FFFFFF] font-sans">
    <header className="flex h-[52px] items-center px-[16px]">
      <button type="button" onClick={onBack} aria-label="뒤로가기">
        <ChevronLeft size={24} className="text-[#111111]" />
      </button>
    </header>
    <div className="flex flex-1 items-center justify-center px-[16px] text-center text-[13px] text-[#767676]">
      {message}
    </div>
  </div>
);

const TradeDetailPage = () => {
  const { tradeId = '' } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const tradeIdNumber = Number(tradeId);
  const isValidId = tradeId !== '' && Number.isFinite(tradeIdNumber);

  const { data: trade, isPending, isError, error } = useTradeDetail(tradeIdNumber);
  const statusChangeMutation = useTradeStatusChange(tradeIdNumber);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [showDeliverToast, setShowDeliverToast] = useState(false);
  const [showShippingToast, setShowShippingToast] = useState(() =>
    Boolean((location.state as { shippingConfirmed?: boolean } | null)?.shippingConfirmed),
  );
  const shippingToastHandledRef = useRef(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!showShippingToast || shippingToastHandledRef.current) return;
    shippingToastHandledRef.current = true;

    navigate(location.pathname + location.search, { replace: true, state: {} });
    const timer = setTimeout(() => setShowShippingToast(false), 2000);
    return () => clearTimeout(timer);
  }, [showShippingToast, location, navigate]);

  const handleBack = () => navigate(-1);

  if (!isValidId) {
    return <MessageScreen message="거래 정보를 찾을 수 없습니다." onBack={handleBack} />;
  }

  if (isPending) {
    return <MessageScreen message="불러오는 중..." onBack={handleBack} />;
  }

  if (isError) {
    // TRADE_404는 존재하지 않는 거래이거나, 아직 Trade로 전환되지 않은
    // 제안 단계(PurchaseIntent) 항목인 경우 둘 다에 해당한다 (#87에서 분리 예정).
    const isNotFound = error instanceof ApiError && error.code === 'TRADE_404';
    return (
      <MessageScreen
        message={
          isNotFound
            ? '제안 대기 중이거나 존재하지 않는 거래입니다. 이 화면은 곧 지원될 예정입니다.'
            : '거래 정보를 불러오지 못했습니다.'
        }
        onBack={handleBack}
      />
    );
  }

  if (!trade) {
    return <MessageScreen message="거래 정보를 찾을 수 없습니다." onBack={handleBack} />;
  }

  const isBuyer = trade.viewerMode === 'BUYER';
  const { steps: timelineSteps, currentStepIndex } = buildTradeTimeline(trade);
  const canRegisterShipping =
    !trade.trackingNumber && trade.availableActions.includes(ACTION_REGISTER_SHIPMENT);
  const canConfirmPurchase = trade.availableActions.includes(ACTION_CONFIRM_PURCHASE);
  const canMarkDelivered = !isBuyer && trade.availableActions.includes(ACTION_MARK_DELIVERED);
  const deliveryCarrierLabel = trade.customDeliveryCarrierName ?? trade.deliveryCarrier ?? '-';
  // currentStepIndex < 2 → shippedAt이 아직 없는 단계(결제 완료까지만 진행). 상품 발송부터 배송지 공개.
  const isBeforeShipped = currentStepIndex < 2;

  const handleConfirmPurchase = () => {
    statusChangeMutation.mutate(
      { status: 'PURCHASE_CONFIRMED' },
      {
        onSuccess: () => {
          setShowConfirmModal(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2000);
        },
        onError: (mutationError) => console.error(mutationError),
      },
    );
  };

  const handleMarkDelivered = () => {
    statusChangeMutation.mutate(
      { status: 'DELIVERED' },
      {
        onSuccess: () => {
          setShowDeliverModal(false);
          setShowDeliverToast(true);
          setTimeout(() => setShowDeliverToast(false), 2000);
        },
        onError: (mutationError) => console.error(mutationError),
      },
    );
  };

  const handleChat = async () => {
    if (isChatLoading) return;
    setIsChatLoading(true);
    try {
      const { chatRoomId } = await createOrGetChatRoomByTrade(trade.tradeId);
      navigate(`/chat/${chatRoomId}`);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="sticky top-0 z-10 flex h-[52px] items-center justify-between border-b border-[#F0F0F0] bg-white px-[16px]">
        <button type="button" onClick={handleBack} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111111]">거래 상세</h1>
        <div className="size-[24px]" />
      </header>

      <div className="flex items-center gap-3 border-b border-[#F0F0F0] p-[16px]">
        <div className="size-[48px] shrink-0 rounded-[8px] bg-[#F5F6F8]" />
        <div className="flex flex-col gap-1">
          {/* TODO: 아이템 상세(브랜드/이름) 조회 API 연동 전까지 itemId만 임시 표시 */}
          <p className="text-[15px] font-semibold text-[#111111]">아이템 #{trade.itemId}</p>
          <div className="flex items-center gap-1 text-[13px] text-[#767676]">
            <span className="text-[#111111]">{formatPrice(trade.itemPrice)}</span>
          </div>
          {trade.trackingNumber ? (
            <p className="text-[12px] text-[#767676]">
              {deliveryCarrierLabel} 택배 {trade.trackingNumber}
            </p>
          ) : canRegisterShipping ? (
            <button
              type="button"
              onClick={() => navigate(`/trade/${trade.tradeId}/shipping`)}
              className="text-[12px] text-[#00AAFF]"
            >
              운송 번호 입력
            </button>
          ) : (
            <p className="text-[12px] text-[#767676]">운송 번호 없음</p>
          )}
        </div>
      </div>

      <div className="border-b border-[#F0F0F0] px-[16px] py-[20px]">
        <div className="flex flex-col">
          {timelineSteps.map((step, index) => {
            const isDone = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isLast = index === timelineSteps.length - 1;

            const textClass = isDone
              ? 'text-[#111111]'
              : isCurrent
                ? 'font-semibold text-[#00AAFF]'
                : 'text-[#767676]';

            return (
              <div key={step.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {isDone || isCurrent ? (
                    <CheckCircle2
                      size={20}
                      className={isDone ? 'text-[#111111]' : 'text-[#00AAFF]'}
                    />
                  ) : (
                    <span className="size-[20px] rounded-full border-2 border-[#E2E6E8]" />
                  )}
                  {!isLast && <span className="h-[24px] w-[1px] bg-[#E2E6E8]" />}
                </div>
                <div className="flex flex-1 items-center justify-between pb-[8px]">
                  <div className="flex items-center gap-2">
                    <span className={`text-[14px] ${textClass}`}>{step.label}</span>
                    {step.date && <span className="text-[12px] text-[#767676]">{step.date}</span>}
                  </div>
                  {step.label === '상품 발송' && trade.trackingNumber && (
                    <span className="text-[12px] text-[#767676]">
                      {deliveryCarrierLabel} 택배 {trade.trackingNumber}
                    </span>
                  )}
                  {step.label === '상품 발송' && !trade.trackingNumber && !canRegisterShipping && (
                    <span className="text-[12px] text-[#767676]">운송 번호 없음</span>
                  )}
                </div>
              </div>
            );
          })}
          {canMarkDelivered && (
            <div className="pt-[12px]">
              <Button
                variant="filled"
                size="54"
                className="!w-full"
                onClick={() => setShowDeliverModal(true)}
              >
                배송 완료 처리
              </Button>
            </div>
          )}
          {canConfirmPurchase && (
            <div className="pt-[12px]">
              <Button
                variant="filled"
                size="54"
                className="!w-full"
                onClick={() => setShowConfirmModal(true)}
              >
                구매확정
              </Button>
            </div>
          )}
        </div>
      </div>

      <SectionTitle>상품 정보</SectionTitle>
      <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        <div className="flex items-center gap-3">
          <div className="size-[48px] shrink-0 rounded-[8px] bg-[#F5F6F8]" />
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-[#111111]">아이템 #{trade.itemId}</p>
            <p className="text-[12px] text-[#767676]">{TRADE_STATUS_LABEL[trade.status]}</p>
          </div>
        </div>
      </div>

      <div className="border-b border-[#F0F0F0] p-[16px]">
        <p className="text-[12px] leading-[1.5] text-[#767676]">
          결제 승인이 임시로 확보되었습니다.
        </p>
        <p className="text-[12px] leading-[1.5] text-[#767676]">
          거래가 안전하게 완료될 때까지 안전하게 보관돼요.
        </p>
      </div>

      <SectionTitle>{isBuyer ? '판매자 정보' : '구매자 정보'}</SectionTitle>
      <div className="flex items-center justify-between border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        <div className="flex items-center gap-3">
          {trade.counterpart.profileImageUrl ? (
            <img
              src={resolveImageUrl(trade.counterpart.profileImageUrl)}
              alt={trade.counterpart.username}
              className="size-[40px] shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="size-[40px] shrink-0 rounded-full bg-[#F5F6F8]" />
          )}
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-[#111111]">{trade.counterpart.username}</p>
            <p className="text-[12px] text-[#767676]">
              팔로워 {trade.counterpart.followerCount.toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="36" onClick={handleChat} disabled={isChatLoading}>
          채팅하기
        </Button>
      </div>

      <SectionTitle>배송지</SectionTitle>
      <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        <div className="flex flex-col gap-2">
          <InfoRow label="택배사" value={deliveryCarrierLabel} />
          <InfoRow label="운송장 번호" value={trade.trackingNumber ?? '-'} />
          {isBeforeShipped ? (
            <p className="pt-[8px] text-[13px] text-[#767676]">배송 전에는 확인할 수 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-1 pt-[8px]">
              <p className="text-[13px] text-[#111111]">
                {trade.deliveryReceiverName} · {trade.deliveryPhone}
              </p>
              <p className="text-[13px] text-[#111111]">
                {trade.deliveryPostalCode && `[${trade.deliveryPostalCode}] `}
                {trade.deliveryAddressLine1} {trade.deliveryAddressLine2}
              </p>
              {trade.deliveryRequestNote && (
                <p className="text-[12px] text-[#767676]">{trade.deliveryRequestNote}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {trade.tradeRequestNote != null && (
        <>
          <SectionTitle>거래 요청사항</SectionTitle>
          <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
            <div className="rounded-[8px] border border-[#F0F0F0] px-[14px] py-[12px]">
              <p className="text-[13px] leading-[1.6] text-[#111111]">{trade.tradeRequestNote}</p>
            </div>
          </div>
        </>
      )}

      <SectionTitle>{isBuyer ? '결제 정보' : '정산 정보'}</SectionTitle>
      <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        {isBuyer ? (
          <div className="flex flex-col gap-2">
            <InfoRow label="상품 금액" value={formatPrice(trade.itemPrice)} />
            <InfoRow label="배송비" value={`+${formatPrice(trade.shippingFee)}`} />
            <InfoRow label="수수료" value={`-${formatPrice(trade.buyerServiceFee)}`} />
            <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-[8px]">
              <span className="text-[13px] text-[#767676]">결제 금액</span>
              <span className="text-[15px] font-semibold text-[#FF3B30]">
                {formatPrice(trade.paymentAmount)}
              </span>
            </div>
            {/* TODO: 결제 수단은 TradeDetailResponse에 없어 임시로 "-" 표시 */}
            <InfoRow label="결제 수단" value="-" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <InfoRow label="상품 금액" value={formatPrice(trade.itemPrice)} />
            <InfoRow label="배송비" value={`+${formatPrice(trade.shippingFee)}`} />
            <InfoRow label="수수료" value={`-${formatPrice(trade.sellerServiceFee ?? 0)}`} />
            <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-[8px]">
              <span className="text-[13px] text-[#767676]">총 정산 금액</span>
              <span className="text-[15px] font-semibold text-[#111111]">
                {formatPrice(trade.settlementAmount ?? 0)}
              </span>
            </div>
            {/* TODO: 정산 계좌는 TradeDetailResponse에 없어 임시로 "-" 표시 */}
            <InfoRow label="정산 계좌" value="-" />
          </div>
        )}
      </div>

      <div className="p-[16px]">
        <p className="text-[12px] leading-[1.5] text-[#767676]">
          구매자는 아이템의 기록을 이어서 받게됩니다.
        </p>
        {isBuyer ? (
          <button type="button" className="text-[12px] leading-[1.5] text-[#00AAFF]">
            아이템 기록 확인하기
          </button>
        ) : (
          <p className="text-[12px] leading-[1.5] text-[#767676]">
            정산은 구매 확정 후 자동으로 진행돼요.
          </p>
        )}
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px]">
            <p className="text-[16px] font-semibold text-[#111111]">구매를 확정할까요?</p>
            <p className="mt-[8px] text-[13px] text-[#767676]">
              구매확정 후에는 거래가 완료되며, 판매자에게 정산이 진행됩니다. 꼭 상품을 확인한 뒤
              진행해 주세요.
            </p>
            <div className="mt-[20px]">
              <DoubleButton
                layout="half"
                leftLabel="취소"
                rightLabel="구매확정"
                onLeftClick={() => setShowConfirmModal(false)}
                onRightClick={handleConfirmPurchase}
              />
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed bottom-[24px] left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-[#111111] px-[16px] py-[12px] text-[13px] text-white">
          거래가 확정되었습니다
        </div>
      )}

      {showDeliverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px]">
            <p className="text-[16px] font-semibold text-[#111111]">배송을 완료 처리할까요?</p>
            <p className="mt-[8px] text-[13px] text-[#767676]">
              완료 후에는 이전 단계로 되돌릴 수 없습니다.
            </p>
            <div className="mt-[20px]">
              <DoubleButton
                layout="half"
                leftLabel="취소"
                rightLabel="완료"
                onLeftClick={() => setShowDeliverModal(false)}
                onRightClick={handleMarkDelivered}
              />
            </div>
          </div>
        </div>
      )}

      {showDeliverToast && (
        <div className="fixed bottom-[24px] left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-[#111111] px-[16px] py-[12px] text-[13px] text-white">
          배송이 완료 처리되었습니다
        </div>
      )}

      {showShippingToast && (
        <div className="fixed bottom-[24px] left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-[#111111] px-[16px] py-[12px] text-[13px] text-white">
          배송 정보가 확인되었습니다
        </div>
      )}
    </div>
  );
};

export default TradeDetailPage;
