import { useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Clock } from 'lucide-react';
import { BackHeader, Button, DoubleButton } from '@/shared/components';
import { cn } from '@/shared/lib/cn';

interface CounterpartUser {
  userId: number;
  username: string;
  profileImageUrl: string | null;
}

interface ProposalAmounts {
  productAmount: number;
  shippingFee: number;
  buyerServiceFee: number;
  sellerServiceFee: number;
  buyerPaymentAmount: number;
  sellerSettlementAmount: number;
}

interface ProposalDelivery {
  receiverName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  requestNote: string | null;
}

export interface ProposalDetailContentProps {
  proposalType: 'OFFER' | 'PURCHASE_INTENT';
  isBuyer: boolean;
  title: string;
  status: string;
  remainingSeconds: number;
  itemNavigationPath: string;
  brandName: string;
  itemName: string;
  imageUrl?: string | null;
  productPrice?: number;
  amounts: ProposalAmounts;
  counterpart: CounterpartUser;
  delivery: ProposalDelivery | null;
  deliveryDisclosureStatus: 'VISIBLE' | 'HIDDEN';
  tradeRequestNote?: string | null;
  paymentMethodId: string;
  onAccept: () => void;
  onReject: () => void;
  onCancel: () => void;
  isMutating: boolean;
}

const formatPrice = (value: number) => `${value.toLocaleString('ko-KR')}원`;

const formatRemaining = (seconds: number): string => {
  if (seconds <= 0) return '만료됨';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}시간 ${m}분 남음`;
  const s = seconds % 60;
  if (m > 0) return `${m}분 ${s}초 남음`;
  return `${s}초 남음`;
};

const STATUS_BADGE: Record<string, { label: string; className: string } | undefined> = {
  SENT: { label: '응답 대기', className: 'bg-[#FFEECC] text-[#CC9200]' },
  ACCEPTED: { label: '수락됨', className: 'bg-[#FFEECC] text-[#CC9200]' },
  REJECTED: { label: '거절됨', className: 'bg-[#FFEECC] text-[#CC9200]' },
  CANCELED: { label: '취소됨', className: 'bg-[#FFEECC] text-[#CC9200]' },
  EXPIRED: { label: '만료됨', className: 'bg-[#FFEECC] text-[#CC9200]' },
};

// 다이얼로그
const ActionDialog = ({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  cancelLabel: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-bg-white w-full max-w-[340px] rounded-xl p-6 text-center">
        <p className="text-title-3 text-text-primary">{title}</p>
        <p className="text-body-2 text-text-secondary mt-2">{description}</p>
        <div className="mt-5 flex gap-[10px]">
          <Button variant="ghost" size="54" className="min-w-0 flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="filled"
            size="54"
            className={cn('min-w-0 flex-1', danger && '!bg-error text-text-inverse')}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <p className="text-body-1 text-text-primary pb-3 font-semibold">{children}</p>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-2">
    <span className="text-body-3 text-text-secondary shrink-0">{label}</span>
    <span className="text-body-3 text-text-primary text-right">{value}</span>
  </div>
);

const ProposalDetailContent = ({
  proposalType,
  isBuyer,
  title,
  status,
  remainingSeconds: initialRemaining,
  itemNavigationPath,
  brandName,
  itemName,
  imageUrl,
  productPrice,
  amounts,
  counterpart,
  delivery,
  deliveryDisclosureStatus,
  tradeRequestNote,
  paymentMethodId,
  onAccept,
  onReject,
  onCancel,
  isMutating,
}: ProposalDetailContentProps) => {
  const navigate = useNavigate();
  const [remaining, setRemaining] = useState(initialRemaining);
  const [dialog, setDialog] = useState<'accept' | 'reject' | 'cancel' | null>(null);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  const isOffer = proposalType === 'OFFER';
  const isVisible = deliveryDisclosureStatus === 'VISIBLE';
  const isActionable = status === 'SENT';
  const badge = STATUS_BADGE[status];
  const proposalLabel = isOffer ? '구매 제안' : '거래 의사';

  return (
    <div className="bg-bg-white relative min-h-screen w-full font-sans">
      <div className="pb-[60px]">
        <BackHeader title="" />

        {/* 상태 헤더 */}
        <div className="border-border-light border-b-5 px-[16px] pb-[20px]">
          <h1 className="text-title-2 text-text-primary mb-2 pt-2 font-bold whitespace-pre-line">
            {title}
          </h1>

          {badge && (
            <span
              className={`text-body-4 mb-[10px] inline-flex items-center rounded-sm px-2 py-1 font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          )}

          {isActionable && (
            <div className="mb-[8px] flex items-center gap-[6px]">
              <Clock size={14} className="text-text-primary shrink-0" />
              <span className="text-body-2 text-error font-semibold">
                제안 만료까지 {formatRemaining(remaining)}
              </span>
            </div>
          )}

          <p className="text-body-3 text-text-tertiary leading-[1.6]">
            판매자가 24시간 내에 응답하지 않으면 자동으로 취소됩니다.
          </p>
          <p className="text-body-3 text-text-tertiary leading-[1.6]">
            수락되기 전까지 요청을 취소할 수 있습니다.
          </p>
        </div>

        {/* 상품 정보 */}
        <div className="border-gray-default border-b-5 p-[16px]">
          <SectionTitle>상품 정보</SectionTitle>

          <button
            type="button"
            className="bg-bg-quaternary mb-[16px] flex w-full items-center gap-[12px] rounded-sm px-3 py-2 text-left"
            onClick={() => navigate(itemNavigationPath)}
          >
            <div className="bg-bg-primary size-[64px] shrink-0 overflow-hidden rounded-md">
              {imageUrl && <img src={imageUrl} alt={itemName} className="size-full object-cover" />}
            </div>
            <div className="flex-1">
              <p className="text-body-1 text-text-primary font-semibold">
                {brandName} / {itemName}
              </p>
              {isOffer ? (
                <p className="text-body-3 text-text-secondary">미판매 상품</p>
              ) : (
                <>
                  <p className="text-body-3 text-text-secondary">판매 상품</p>
                  {productPrice !== undefined && (
                    <p className="text-body-2 text-error font-semibold">
                      {formatPrice(productPrice)}
                    </p>
                  )}
                </>
              )}
            </div>
            <ChevronRight size={16} className="text-text-secondary shrink-0" />
          </button>

          {/* 금액 내역 */}
          <div className="flex flex-col gap-[8px]">
            <InfoRow
              label={isOffer ? '제안 금액' : '상품 금액'}
              value={formatPrice(amounts.productAmount)}
            />
            <InfoRow label="배송비" value={`+${formatPrice(amounts.shippingFee)}`} />
            <InfoRow
              label="수수료"
              value={
                isBuyer
                  ? `+${formatPrice(amounts.buyerServiceFee)}`
                  : amounts.sellerServiceFee === 0
                    ? '0원'
                    : `-${formatPrice(amounts.sellerServiceFee)}`
              }
            />
            <div className="border-border-light flex items-center justify-between border-t pt-[8px]">
              <span className="text-body-2 text-text-primary font-semibold">
                {isBuyer ? '총 결제 금액' : '총 정산 예정 금액'}
              </span>
              <span className="text-title-4 text-text-primary font-bold">
                {formatPrice(isBuyer ? amounts.buyerPaymentAmount : amounts.sellerSettlementAmount)}
              </span>
            </div>
          </div>

          <p className="text-body-3 font-regular text-text-secondary mt-[12px] leading-[1.6]">
            결제 승인이 임시로 확보되었습니다.
          </p>
          <p className="text-body-3 font-regular text-text-secondary leading-[1.6]">
            판매자가 수락하면 최종 결제되며, 거절·취소·만료 시 승인이 해제됩니다.
          </p>
        </div>

        {/* 구매자/판매자 정보 */}
        <div className="border-border-light border-b-5 p-[16px]">
          <SectionTitle>{isBuyer ? '판매자 정보' : '구매자 정보'}</SectionTitle>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="bg-bg-quaternary size-[60px] shrink-0 overflow-hidden rounded-full">
                {counterpart.profileImageUrl && (
                  <img
                    src={counterpart.profileImageUrl}
                    alt={counterpart.username}
                    className="size-full object-cover"
                  />
                )}
              </div>
              <p className="text-body-1 text-text-primary font-semibold">{counterpart.username}</p>
            </div>
            <Button
              variant="ghost"
              size="36"
              className="bg-text-primary font-regular text-text-inverse"
            >
              채팅하기
            </Button>
          </div>
        </div>

        {/* 배송지 */}
        {delivery && (
          <div className="border-border-light border-b-5 p-[16px]">
            <SectionTitle>배송지</SectionTitle>
            <div className="flex flex-col gap-[8px]">
              <InfoRow label="수령인" value={delivery.receiverName} />
              <InfoRow label="주소" value={delivery.addressLine1} />
              {delivery.addressLine2 && (
                <InfoRow label="상세주소" value={isVisible ? delivery.addressLine2 : '•••••••••'} />
              )}
              <InfoRow label="연락처" value={isVisible ? delivery.phone : '•••••••••'} />
              {delivery.requestNote && <InfoRow label="요청사항" value={delivery.requestNote} />}
            </div>
          </div>
        )}

        {/* 구매자 요청사항 */}
        {tradeRequestNote != null && (
          <div className="border-border-light border-b-5 p-[16px]">
            <SectionTitle>구매자 요청사항</SectionTitle>
            <div className="border-border-light bg-bg-white rounded-md border-2 px-[14px] py-[12px]">
              <p className="text-body-3 text-text-primary leading-[1.6]">{tradeRequestNote}</p>
            </div>
          </div>
        )}

        {/* 정산/결제 정보 */}
        <div className="border-border-light border-b-5 p-[16px]">
          <SectionTitle>{isBuyer ? '결제 정보' : '정산 정보'}</SectionTitle>
          {isBuyer ? (
            <div className="flex flex-col gap-[8px]">
              <div className="flex items-center justify-between">
                <span className="text-body-3 text-text-secondary">최종 결제 금액</span>
                <span className="text-title-4 font-bold text-[#FF3B30]">
                  {formatPrice(amounts.buyerPaymentAmount)}
                </span>
              </div>
              {/* TODO: paymentMethodId를 표시용 레이블로 변환하는 API 연동 필요 */}
              <InfoRow label="결제 수단" value={paymentMethodId} />
            </div>
          ) : (
            <div className="flex flex-col gap-[8px]">
              <InfoRow label="정산 금액" value={formatPrice(amounts.sellerSettlementAmount)} />
              {/* TODO: 정산 계좌 조회 API 연동 필요 */}
              <InfoRow label="정산 계좌" value="-" />
            </div>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="p-[16px]">
          <p className="text-body-3 text-text-secondary leading-[1.6]">
            구매자는 아이템의 기록을 이어서 받게됩니다.
          </p>
          <p className="text-body-4 text-text-secondary leading-[1.6]">
            실착 이력, 공개 OOTD 연결, 소유자 히스토리, 판매 재등록 시 이전 기록
          </p>
          {isBuyer && (
            <p className="text-body-4 text-warning mt-[8px] leading-[1.6]">
              구매 제안이 취소·만료·거절되면 사용한 제안 기회는 복구되지 않아요.
            </p>
          )}
        </div>
      </div>

      {/* 고정 하단 버튼 */}
      <div className="border-border-light bg-bg-white fixed inset-x-0 bottom-0 border-t px-[16px] py-[12px]">
        {isBuyer ? (
          <Button
            variant="solid"
            size="54"
            className="!w-full"
            onClick={() => setDialog('cancel')}
            disabled={isMutating || !isActionable}
          >
            제안 취소하기
          </Button>
        ) : (
          <DoubleButton
            layout="half"
            leftLabel="거절하기"
            rightLabel="수락하기"
            onLeftClick={() => setDialog('reject')}
            onRightClick={() => setDialog('accept')}
            disabled={isMutating || !isActionable}
          />
        )}
      </div>

      <ActionDialog
        open={dialog === 'reject'}
        title={`${proposalLabel}을 거절할까요?`}
        description="거절한 제안은 다시 수락할 수 없어요."
        cancelLabel="취소"
        confirmLabel="거절하기"
        danger
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          setDialog(null);
          onReject();
        }}
      />
      <ActionDialog
        open={dialog === 'cancel'}
        title={`${proposalLabel}을 취소할까요?`}
        description="취소한 제안은 다시 요청할 수 없어요."
        cancelLabel="뒤로가기"
        confirmLabel="예"
        danger
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          setDialog(null);
          onCancel();
        }}
      />
      <ActionDialog
        open={dialog === 'accept'}
        title={`${proposalLabel}을 수락할까요?`}
        description="수락 즉시 결제가 확정되며 되돌릴 수 없어요."
        cancelLabel="취소"
        confirmLabel="수락하기"
        onCancel={() => setDialog(null)}
        onConfirm={() => {
          setDialog(null);
          onAccept();
        }}
      />
    </div>
  );
};

export default ProposalDetailContent;
