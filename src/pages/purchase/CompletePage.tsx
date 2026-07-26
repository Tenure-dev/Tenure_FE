import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { DoubleButton } from '@/shared/components';
import { useOfferStore } from '@/store/offerStore';
import StepProgress from './components/StepProgress';

const CompletePage = () => {
  const navigate = useNavigate();
  const { sellerNickname, reset } = useOfferStore();

  const handleConfirm = () => {
    reset();
    navigate('/', { replace: true });
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
          <p className="text-title-2 text-text-primary font-semibold">구매 제안을 보냈어요</p>
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

export default CompletePage;
