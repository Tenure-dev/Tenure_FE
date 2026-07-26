import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader } from '@/shared/components';
import StepProgress from './components/StepProgress';

const ProcessingPage = () => {
  const { itemId = '' } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/item/${itemId}/purchase/complete`, { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, itemId]);

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
};

export default ProcessingPage;
