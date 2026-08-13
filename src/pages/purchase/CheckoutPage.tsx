import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { BackHeader, Button } from '@/shared/components';
import { useProductDetail } from '@/features/product/model/useProductDetail';
import { useItemDetailQuery } from '@/features/mypage/model/useItemDetailQuery';
import { useOfferStore, type PaymentMethod } from '@/store/offerStore';
import { useAddresses } from '@/features/purchase/model/useAddresses';
import { cn } from '@/shared/lib/cn';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import StepProgress from './components/StepProgress';
import ItemSummaryCard from './components/ItemSummaryCard';

const SHIPPING_FEE = 5_000;

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'toss', label: '토스페이' },
  { value: 'kakao', label: '카카오페이' },
  { value: 'naver', label: '네이버페이' },
];

const CheckoutPage = () => {
  const { productId = '', itemId = '' } = useParams();
  const isOfferFlow = !!itemId && !productId;
  const { state } = useLocation();
  const navigate = useNavigate();

  const offerPrice = useOfferStore((s) => s.price);
  const offerSellerNickname = useOfferStore((s) => s.sellerNickname);
  const tradeRequest = useOfferStore((s) => s.tradeRequest);
  const paymentMethod = useOfferStore((s) => s.paymentMethod);
  const setItemId = useOfferStore((s) => s.setItemId);
  const setSellerNickname = useOfferStore((s) => s.setSellerNickname);
  const setTradeRequest = useOfferStore((s) => s.setTradeRequest);
  const setPaymentMethod = useOfferStore((s) => s.setPaymentMethod);

  const [agreeOrder, setAgreeOrder] = useState(false);
  const [agreeAuto, setAgreeAuto] = useState(false);

  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useProductDetail(isOfferFlow ? NaN : Number(productId));
  const {
    data: itemData,
    isLoading: itemLoading,
    isError: itemError,
  } = useItemDetailQuery(Number(itemId), { enabled: isOfferFlow });

  const { defaultAddress } = useAddresses();

  const isLoading = isOfferFlow ? itemLoading : productLoading;
  const isError = isOfferFlow ? itemError : productError;

  if (isLoading) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (isError || (isOfferFlow && !itemData) || (!isOfferFlow && !productData)) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        아이템 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const isDirect = (state as { direct?: boolean } | null)?.direct === true;

  const displayImageUrl = isOfferFlow
    ? (resolveImageUrl(itemData?.representativeImageUrl) ?? '')
    : (resolveImageUrl(productData?.mainImageUrl) ?? '');
  const displayBrand = isOfferFlow
    ? (itemData?.brandName ?? '')
    : (productData?.item.brandName ?? '');
  const displayName = isOfferFlow ? (itemData?.itemName ?? '') : (productData?.item.itemName ?? '');
  const displaySeller = isOfferFlow ? offerSellerNickname : (productData?.seller.username ?? '');
  const displayPrice = isDirect ? (productData?.price ?? 0) : offerPrice;

  const fee = Math.round(displayPrice / 30);
  const total = displayPrice + SHIPPING_FEE + fee;
  const canPay = !!defaultAddress && agreeOrder && agreeAuto;

  const handlePay = () => {
    if (isDirect && productData) {
      setItemId(productData.item.itemId);
      setSellerNickname(productData.seller.username);
    }
    if (isOfferFlow) {
      navigate(`/product/${itemId}/offer/processing`, { replace: true });
    } else {
      navigate(`/product/${productId}/purchase/processing`, {
        state: { direct: isDirect },
        replace: true,
      });
    }
  };

  return (
    <div className="bg-bg-white flex min-h-screen flex-col pb-[86px]">
      <BackHeader title="주문/결제" />
      <StepProgress currentStep={2} />

      {/* 상품 정보 */}
      <section className="px-4 pt-4">
        <h2 className="text-title-4 text-text-primary mb-3 font-bold">상품 정보</h2>
        <ItemSummaryCard
          imageUrl={displayImageUrl}
          brand={displayBrand}
          name={displayName}
          sellerNickname={displaySeller}
          subline="주문자 : 홍길동 · 010-xxxx-xxxx"
        />
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-body-2 text-text-secondary">상품 금액</span>
            <span className="text-body-2 text-text-primary">
              {displayPrice.toLocaleString('ko-KR')}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-body-2 text-text-secondary">배송비</span>
            <span className="text-body-2 text-text-primary">
              +{SHIPPING_FEE.toLocaleString('ko-KR')}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-body-2 text-text-secondary">수수료</span>
            <span className="text-body-2 text-text-primary">+{fee.toLocaleString('ko-KR')}원</span>
          </div>
          <div className="border-border flex justify-between border-t pt-2">
            <span className="text-body-1 text-text-primary font-bold">총 결제 금액</span>
            <span className="text-body-1 text-text-primary font-bold">
              {total.toLocaleString('ko-KR')}원
            </span>
          </div>
        </div>
      </section>

      <div className="bg-bg-quaternary mt-4 h-2" />

      {/* 배송지 */}
      <section className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-title-4 text-text-primary font-bold">배송지</h2>
            {defaultAddress && (
              <span className="bg-bg-secondary text-body-3 text-text-secondary rounded px-1.5 py-0.5">
                기본
              </span>
            )}
          </div>
          <button type="button" className="text-body-3 text-text-secondary underline">
            주소 변경
          </button>
        </div>

        {defaultAddress ? (
          <div className="flex flex-col gap-2">
            <div className="flex gap-4">
              <span className="text-body-3 text-text-secondary w-14 shrink-0">받는 분</span>
              <span className="text-body-3 text-text-primary">{defaultAddress.receiverName}</span>
            </div>
            <div className="flex gap-4">
              <span className="text-body-3 text-text-secondary w-14 shrink-0">주소</span>
              <span className="text-body-3 text-text-primary">
                {defaultAddress.addressLine1} {defaultAddress.addressLine2}
              </span>
            </div>
            <div className="flex gap-4">
              <span className="text-body-3 text-text-secondary w-14 shrink-0">연락처</span>
              <span className="text-body-3 text-text-primary">{defaultAddress.phone}</span>
            </div>
            {defaultAddress.requestNote && (
              <div className="flex gap-4">
                <span className="text-body-3 text-text-secondary w-14 shrink-0">요청사항</span>
                <span className="text-body-3 text-text-primary">{defaultAddress.requestNote}</span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-body-3 text-text-secondary">등록된 배송지가 없습니다.</p>
        )}
      </section>

      <div className="bg-bg-quaternary h-2" />

      {/* 거래 요청사항 */}
      <section className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-title-4 text-text-primary font-bold">거래 요청사항</h2>
          <button
            type="button"
            onClick={() => setTradeRequest('')}
            className="text-body-3 text-text-secondary underline"
          >
            초기화
          </button>
        </div>
        <textarea
          value={tradeRequest}
          onChange={(e) => setTradeRequest(e.target.value)}
          placeholder="판매자에게 남기고 싶은 말을 작성해주세요."
          rows={3}
          className="border-border text-body-2 text-text-primary placeholder:text-text-secondary w-full resize-none rounded-xl border bg-transparent px-4 py-3 outline-none"
        />
      </section>

      <div className="bg-bg-quaternary h-2" />

      {/* 결제 수단 */}
      <section className="p-4">
        <h2 className="text-title-4 text-text-primary mb-3 font-bold">결제 수단</h2>
        <div className="flex flex-col gap-3">
          {PAYMENT_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPaymentMethod(value)}
              className="flex items-center gap-3"
            >
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded-full border-2',
                  paymentMethod === value ? 'border-brand' : 'border-border',
                )}
              >
                {paymentMethod === value && <div className="bg-brand size-2.5 rounded-full" />}
              </div>
              <span className="text-body-2 text-text-primary">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="bg-bg-quaternary h-2" />

      {/* 동의 */}
      <section className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-body-3 text-text-secondary">
              주문 내용을 확인하였으며 결제 동의합니다.
            </span>
            <span className="text-body-3 text-text-secondary">자세히</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-body-3 text-text-secondary">
              회원님의 개인정보는 안전하게 관리됩니다.
            </span>
            <span className="text-body-3 text-text-secondary">자세히</span>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-body-3 text-text-secondary flex-1">
              주문할 상품의 결제, 배송, 주문 정보를 확인하였으며 이에 <strong>동의</strong>합니다.
            </span>
            <button
              type="button"
              onClick={() => setAgreeOrder((p) => !p)}
              className="mt-0.5 shrink-0"
            >
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded',
                  agreeOrder ? 'bg-brand' : 'border-bg-secondary border',
                )}
              >
                {agreeOrder && <Check size={13} strokeWidth={3} className="text-white" />}
              </div>
            </button>
          </div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-body-3 text-text-secondary flex-1">
              배송 완료 72시간 후 자동으로 구매확정 됩니다.
            </span>
            <button
              type="button"
              onClick={() => setAgreeAuto((p) => !p)}
              className="mt-0.5 shrink-0"
            >
              <div
                className={cn(
                  'flex size-5 items-center justify-center rounded',
                  agreeAuto ? 'bg-brand' : 'border-bg-secondary border',
                )}
              >
                {agreeAuto && <Check size={13} strokeWidth={3} className="text-white" />}
              </div>
            </button>
          </div>
        </div>
      </section>

      <div className="bg-bg-white fixed bottom-0 left-1/2 w-full max-w-[768px] min-w-[320px] -translate-x-1/2 px-4 py-3">
        <Button
          variant="filled"
          size="54"
          className="!w-full"
          disabled={!canPay}
          onClick={handlePay}
        >
          결제하기
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;
