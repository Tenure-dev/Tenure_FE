import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { BackHeader, DoubleButton } from '@/shared/components';
import { useOfferStore } from '@/store/offerStore';
import { useAddresses } from '@/features/purchase/model/useAddresses';
import { useCreateOffer } from '@/features/product/model/useCreateOffer';
import { useCreatePurchaseIntent } from '@/features/product/model/useCreatePurchaseIntent';
import StepProgress from './components/StepProgress';

type View = 'processing' | 'complete' | 'error';

const ProcessingPage = () => {
  const { productId = '' } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const isDirect = (state as { direct?: boolean } | null)?.direct === true;

  const itemId = useOfferStore((s) => s.itemId);
  const price = useOfferStore((s) => s.price);
  const tradeRequest = useOfferStore((s) => s.tradeRequest);
  const paymentMethod = useOfferStore((s) => s.paymentMethod);
  const sellerNickname = useOfferStore((s) => s.sellerNickname);
  const reset = useOfferStore((s) => s.reset);

  const { defaultAddress } = useAddresses();
  const { mutate: submitOffer } = useCreateOffer();
  const { mutate: submitIntent } = useCreatePurchaseIntent();

  const [view, setView] = useState<View>('processing');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (isDirect) {
      submitIntent(
        {
          productId: Number(productId),
          deliveryAddressId: defaultAddress!.addressId,
          paymentMethodId: paymentMethod,
          agreement: true,
        },
        {
          onSuccess: () => setView('complete'),
          onError: () => setView('error'),
        },
      );
      return;
    }

    submitOffer(
      {
        itemId,
        offerPrice: price,
        deliveryAddressId: defaultAddress!.addressId,
        paymentMethodId: paymentMethod,
        tradeRequestNote: tradeRequest,
        agreement: true,
      },
      {
        onSuccess: () => setView('complete'),
        onError: () => setView('error'),
      },
    );
  }, []);

  if (view === 'processing') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <BackHeader title="결제하기" />
        <StepProgress currentStep={3} />
        <div className="flex flex-1 flex-col items-center gap-5 pt-40">
          <div className="border-gray-bg border-t-brand size-18 animate-spin rounded-full border-4" />
          <p className="text-title-2 text-text-primary font-semibold">결제 중...</p>
        </div>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <BackHeader title="결제하기" onBack={() => navigate(-1)} />
        <StepProgress currentStep={3} />
        <div className="flex flex-1 flex-col items-center gap-5 pt-40">
          <p className="text-title-2 text-text-primary font-semibold">결제에 실패했습니다.</p>
          <p className="text-body-2 text-text-secondary">잠시 후 다시 시도해 주세요.</p>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    reset();
    navigate(`/product/${productId}`, { replace: true });
  };

  const handleViewOffer = () => {
    reset();
    navigate('/purchase-history', { replace: true });
  };

  return (
    <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
      <header className="border-border-light bg-bg-white sticky top-0 z-20 flex h-[52px] items-center border-b px-4 md:px-6">
        <button type="button" onClick={handleConfirm} aria-label="닫기">
          <X size={20} className="text-text-primary" />
        </button>
      </header>
      <StepProgress currentStep={4} />
      <div className="flex flex-1 flex-col items-center gap-5 pt-40">
        <div className="bg-brand flex size-[72px] items-center justify-center rounded-full">
          <Check size={36} strokeWidth={2.5} className="text-white" />
        </div>
        <div className="text-center">
          <p className="text-title-2 text-text-primary font-semibold">{sellerNickname}님에게</p>
          <p className="text-title-2 text-text-primary font-semibold">
            {isDirect ? '구매 의사를 보냈어요' : '구매 제안을 보냈어요'}
          </p>
        </div>
      </div>
      <div className="px-4 py-3">
        <DoubleButton
          layout="wide"
          leftLabel="보낸 제안 보기"
          rightLabel="확인"
          onLeftClick={handleViewOffer}
          onRightClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default ProcessingPage;
