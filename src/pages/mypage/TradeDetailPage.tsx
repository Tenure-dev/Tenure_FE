import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, Clock } from 'lucide-react';
import { Button, DoubleButton } from '@/shared/components';
import { formatPrice, TRADE_DETAILS } from './trade/mock';
import type { TradeRole, TradeStatus } from './trade/types';

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="px-[16px] pt-[24px] pb-[8px] text-[12px] text-[#767676]">{children}</p>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[13px] text-[#767676]">{label}</span>
    <span className="text-[13px] text-[#111111]">{value}</span>
  </div>
);

const maskLastDigits = (value: string) =>
  value.replace(/\d+(?!.*\d)/, (match) => '*'.repeat(match.length));

const CLOSED_STATUS_MESSAGE: Partial<Record<TradeStatus, string>> = {
  expired: '제안이 만료되었습니다',
  rejected: '제안이 거절되었습니다',
  cancelled: '제안이 취소되었습니다',
};

const TradeDetailPage = () => {
  const { tradeId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const role: TradeRole = searchParams.get('role') === 'seller' ? 'seller' : 'buyer';
  const trade = TRADE_DETAILS[tradeId];

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showShippingToast, setShowShippingToast] = useState(() =>
    Boolean((location.state as { shippingConfirmed?: boolean } | null)?.shippingConfirmed),
  );
  const shippingToastHandledRef = useRef(false);

  useEffect(() => {
    if (!showShippingToast || shippingToastHandledRef.current) return;
    shippingToastHandledRef.current = true;

    navigate(location.pathname + location.search, { replace: true, state: {} });
    const timer = setTimeout(() => setShowShippingToast(false), 2000);
    return () => clearTimeout(timer);
  }, [showShippingToast, location, navigate]);

  if (!trade) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] items-center justify-center bg-[#FFFFFF] font-sans text-[13px] text-[#767676]">
        거래 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const isPending = trade.status === 'pending';
  const isClosed = trade.status in CLOSED_STATUS_MESSAGE;
  const isBuyer = role === 'buyer';
  const isAwaitingConfirm = isBuyer && trade.status === 'progress' && trade.currentStepIndex === 3;
  const shouldMaskPersonalInfo = role === 'seller' && trade.status === 'done';

  const handleConfirmPurchase = () => {
    setShowConfirmModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center justify-between border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111111]">거래 상세</h1>
        <div className="size-[24px]" />
      </header>

      <div className="flex items-center gap-3 border-b border-[#F0F0F0] p-[16px]">
        <div className="size-[48px] shrink-0 rounded-[8px] bg-[#F5F6F8]" />
        <div className="flex flex-col gap-1">
          <p className="text-[15px] font-semibold text-[#111111]">
            {trade.brand} {trade.itemName}
          </p>
          <div className="flex items-center gap-1 text-[13px] text-[#767676]">
            <span>{trade.productType === 'sale' ? '판매 상품' : '미판매 상품'}</span>
            <span>·</span>
            <span className={isPending ? 'text-[#FF3B30]' : 'text-[#111111]'}>
              {formatPrice(trade.offerPrice)}
            </span>
          </div>
          {trade.orderNumber && (
            <p className="text-[12px] text-[#767676]">주문번호 {trade.orderNumber}</p>
          )}
          {trade.trackingNumber ? (
            <p className="text-[12px] text-[#767676]">
              {trade.courierName} 택배 {trade.trackingNumber}
            </p>
          ) : role === 'seller' && trade.status === 'progress' ? (
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
        {isPending ? (
          <div className="flex flex-col gap-2">
            <span className="w-fit rounded-full bg-[#FFF3E0] px-[8px] py-[2px] text-[12px] text-[#FF9500]">
              응답 대기
            </span>
            <div className="flex items-center gap-1 text-[13px] text-[#FF3B30]">
              <Clock size={14} />
              <span>{trade.deadlineText}</span>
            </div>
            {isBuyer ? (
              <>
                <p className="text-[12px] leading-[1.5] text-[#767676]">
                  판매자가 제안을 수락하면 결제가 진행됩니다.
                </p>
                <p className="text-[12px] leading-[1.5] text-[#767676]">
                  판매자의 응답을 기다려주세요.
                </p>
              </>
            ) : (
              <>
                <p className="text-[12px] leading-[1.5] text-[#767676]">
                  제안을 수락하면 거래가 진행됩니다.
                </p>
                <p className="text-[12px] leading-[1.5] text-[#767676]">
                  제안 만료 전에 응답해주세요.
                </p>
              </>
            )}
          </div>
        ) : isClosed ? (
          <div className="flex items-center justify-center py-[24px]">
            <p className="text-[14px] font-semibold text-[#767676]">
              {CLOSED_STATUS_MESSAGE[trade.status]}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {trade.timeline.map((step, index) => {
              const isDone = index < trade.currentStepIndex;
              const isCurrent = index === trade.currentStepIndex;
              const isLast = index === trade.timeline.length - 1;

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
                    {step.label === '상품 발송' &&
                      role === 'seller' &&
                      trade.status === 'progress' &&
                      !trade.trackingNumber && (
                        <button
                          type="button"
                          onClick={() => navigate(`/trade/${trade.tradeId}/shipping`)}
                          className="text-[13px] text-[#00AAFF]"
                        >
                          운송 번호 입력
                        </button>
                      )}
                    {step.label === '상품 발송' && trade.trackingNumber && (
                      <span className="text-[12px] text-[#767676]">
                        {trade.courierName} 택배 {trade.trackingNumber}
                      </span>
                    )}
                    {step.label === '상품 발송' &&
                      !trade.trackingNumber &&
                      !(role === 'seller' && trade.status === 'progress') && (
                        <span className="text-[12px] text-[#767676]">운송 번호 없음</span>
                      )}
                    {step.label === '구매 확정' && isAwaitingConfirm && (
                      <span className="text-[12px] text-[#FF3B30]">
                        {trade.autoConfirmDeadline}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            {isAwaitingConfirm && (
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
        )}
      </div>

      <SectionTitle>상품 정보</SectionTitle>
      <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        <div className="flex items-center gap-3">
          <div className="size-[48px] shrink-0 rounded-[8px] bg-[#F5F6F8]" />
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-[#111111]">
              {trade.brand} {trade.itemName}
            </p>
            <p className="text-[12px] text-[#767676]">{trade.saleStatus}</p>
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
          <div className="size-[40px] shrink-0 rounded-full bg-[#F5F6F8]" />
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-[#111111]">{trade.counterpart.nickname}</p>
            <p className="text-[12px] text-[#767676]">
              팔로워 {trade.counterpart.followerCount} · 레코드 사용자
            </p>
          </div>
        </div>
        <Button variant="ghost" size="36">
          채팅하기
        </Button>
      </div>

      <SectionTitle>배송지</SectionTitle>
      <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        {trade.status !== 'pending' && !isClosed && (
          <div className="flex justify-end pb-[8px]">
            <Button variant="ghost" size="36">
              배송 조회
            </Button>
          </div>
        )}
        <div className="flex flex-col gap-2">
          <InfoRow label="택배사" value={trade.shippingInfo.courier} />
          <InfoRow label="주문번호" value={trade.shippingInfo.orderNumber} />
          <InfoRow label="받는 분" value={trade.shippingInfo.receiver} />
          <InfoRow label="주소" value={trade.shippingInfo.address} />
          <InfoRow
            label="상세주소"
            value={
              shouldMaskPersonalInfo
                ? maskLastDigits(trade.shippingInfo.addressDetail)
                : trade.shippingInfo.addressDetail
            }
          />
          <InfoRow
            label="연락처"
            value={
              shouldMaskPersonalInfo
                ? maskLastDigits(trade.shippingInfo.phone)
                : trade.shippingInfo.phone
            }
          />
          {trade.shippingInfo.request && (
            <InfoRow label="요청사항" value={trade.shippingInfo.request} />
          )}
        </div>
      </div>

      {trade.buyerRequest && (
        <>
          <SectionTitle>구매자 요청사항</SectionTitle>
          <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
            <div className="rounded-[8px] bg-[#F5F6F8] p-[12px]">
              <p className="text-[13px] text-[#111111]">{trade.buyerRequest}</p>
            </div>
          </div>
        </>
      )}

      <SectionTitle>{isBuyer ? '결제 정보' : '정산 정보'}</SectionTitle>
      <div className="border-b border-[#F0F0F0] px-[16px] pb-[16px]">
        {isBuyer ? (
          <div className="flex flex-col gap-2">
            <InfoRow label="상품 금액" value={formatPrice(trade.offerPrice)} />
            <InfoRow label="배송비" value={`+${formatPrice(trade.shippingFee)}`} />
            <InfoRow label="수수료" value={`-${formatPrice(trade.commissionFee)}`} />
            <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-[8px]">
              <span className="text-[13px] text-[#767676]">결제 금액</span>
              <span className="text-[15px] font-semibold text-[#FF3B30]">
                {formatPrice(trade.paymentAmount)}
              </span>
            </div>
            <InfoRow label="결제 수단" value={trade.paymentMethod} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <InfoRow label="상품 금액" value={formatPrice(trade.offerPrice)} />
            <InfoRow label="배송비" value={`+${formatPrice(trade.shippingFee)}`} />
            <InfoRow label="수수료" value="0원" />
            <div className="flex items-center justify-between border-t border-[#F0F0F0] pt-[8px]">
              <span className="text-[13px] text-[#767676]">총 정산 금액</span>
              <span className="text-[15px] font-semibold text-[#111111]">
                {formatPrice(trade.settlementAmount)}
              </span>
            </div>
            <InfoRow label="정산 계좌" value={trade.settlementAccount} />
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

      {isPending && (
        <div className="p-[16px]">
          {role === 'seller' ? (
            <DoubleButton
              layout="wide"
              leftLabel="거절하기"
              rightLabel="수락하기"
              onLeftClick={() => setShowRejectModal(true)}
              onRightClick={() => {}}
            />
          ) : (
            <Button
              variant="ghost"
              size="54"
              className="!w-full"
              onClick={() => setShowCancelModal(true)}
            >
              제안 취소하기
            </Button>
          )}
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px]">
            <p className="text-[16px] font-semibold text-[#111111]">거래 의사를 거절할까요?</p>
            <p className="mt-[8px] text-[13px] text-[#767676]">
              거부한 제안은 다시 수락할 수 없습니다.
            </p>
            <div className="mt-[20px]">
              <DoubleButton
                layout="half"
                leftLabel="취소"
                rightLabel="거절하기"
                onLeftClick={() => setShowRejectModal(false)}
                onRightClick={() => {
                  setShowRejectModal(false);
                  navigate('/sales-history');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px]">
            <p className="text-[16px] font-semibold text-[#111111]">구매 제안을 취소할까요?</p>
            <p className="mt-[8px] text-[13px] text-[#767676]">
              취소한 제안은 다시 요청할 수 없습니다.
            </p>
            <div className="mt-[20px]">
              <DoubleButton
                layout="half"
                leftLabel="뒤로가기"
                rightLabel="예"
                onLeftClick={() => setShowCancelModal(false)}
                onRightClick={() => {
                  setShowCancelModal(false);
                  navigate('/purchase-history');
                }}
              />
            </div>
          </div>
        </div>
      )}

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

      {showShippingToast && (
        <div className="fixed bottom-[24px] left-1/2 z-50 -translate-x-1/2 rounded-[8px] bg-[#111111] px-[16px] py-[12px] text-[13px] text-white">
          배송 정보가 확인되었습니다
        </div>
      )}
    </div>
  );
};

export default TradeDetailPage;
