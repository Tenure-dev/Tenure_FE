import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronDown, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/shared/components';

const COURIER_OPTIONS = ['CJ대한통운', '우체국택배', 'GS Postbox', 'CU 편의점택배'];

const ShippingInputPage = () => {
  const navigate = useNavigate();
  const { tradeId = '' } = useParams();

  const [trackingNumber, setTrackingNumber] = useState('');
  const [courier, setCourier] = useState('');
  const [isCourierOpen, setIsCourierOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [trackingError, setTrackingError] = useState(false);

  const isFormValid = trackingNumber.trim() !== '' && courier !== '';

  const handleSubmit = () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setTrackingError(false);

    setTimeout(() => {
      setIsLoading(false);
      if (trackingNumber.trim() === '0000000000') {
        setTrackingError(true);
        setShowErrorModal(true);
        return;
      }
      navigate(`/trade/${tradeId}?role=seller`, { state: { shippingConfirmed: true } });
    }, 1200);
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col items-center justify-center gap-4 bg-[#FFFFFF] font-sans">
        <div className="size-[32px] animate-spin rounded-full border-2 border-[#00AAFF] border-t-transparent" />
        <p className="text-[13px] text-[#767676]">
          배송 정보를 찾고 있습니다. 잠시만 기다려주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center justify-between border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="text-[16px] font-semibold text-[#111111]">배송 정보 입력</h1>
        <div className="size-[24px]" />
      </header>

      <p className="px-[16px] pt-[24px] pb-[8px] text-[12px] text-[#767676]">택배사 정보</p>

      <div className="flex flex-col gap-[16px] px-[16px]">
        <div className="flex flex-col gap-[8px]">
          <label className="text-[13px] text-[#767676]">운송장번호</label>
          <div className="relative">
            <input
              value={trackingNumber}
              onChange={(event) => {
                setTrackingNumber(event.target.value);
                if (trackingError) setTrackingError(false);
              }}
              placeholder="운송장번호를 입력해주세요"
              className={`h-[52px] w-full rounded-[8px] border px-[16px] pr-[40px] text-[14px] text-[#111111] outline-none focus:border-[#00AAFF] ${
                trackingError ? 'border-[#FF3B30]' : 'border-[#E2E6E8]'
              }`}
            />
            {trackingNumber && (
              <button
                type="button"
                onClick={() => {
                  setTrackingNumber('');
                  setTrackingError(false);
                }}
                className="absolute top-1/2 right-[12px] -translate-y-1/2 text-[#767676]"
                aria-label="입력 지우기"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {trackingError && <p className="text-[12px] text-[#FF3B30]">운송장번호를 확인해주세요</p>}
        </div>

        <div className="flex flex-col gap-[8px]">
          <label className="text-[13px] text-[#767676]">택배사</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCourierOpen((prev) => !prev)}
              className="flex h-[52px] w-full items-center justify-between rounded-[8px] border border-[#E2E6E8] px-[16px] text-[14px]"
            >
              <span className={courier ? 'text-[#111111]' : 'text-[#767676]'}>
                {courier || '택배사를 선택해주세요'}
              </span>
              <ChevronDown size={18} className="text-[#767676]" />
            </button>
            {isCourierOpen && (
              <div className="absolute top-[56px] left-0 z-10 w-full rounded-[8px] bg-white shadow-[0px_2px_12px_1px_rgba(0,0,0,0.09)]">
                {COURIER_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setCourier(option);
                      setIsCourierOpen(false);
                    }}
                    className="flex h-[44px] w-full items-center px-[16px] text-[14px] text-[#111111]"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-[16px] py-[24px]">
        <Button
          variant="filled"
          size="54"
          className="!w-full"
          disabled={!isFormValid}
          onClick={handleSubmit}
        >
          입력 완료
        </Button>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px] text-center">
            <p className="text-[16px] font-semibold text-[#111111]">주문 정보를 찾을 수 없어요</p>
            <p className="mt-[8px] text-[13px] text-[#767676]">
              입력한 정보가 맞는지 다시 확인해 주세요.
            </p>
            <div className="mt-[20px]">
              <Button
                variant="filled"
                size="54"
                className="!w-full"
                onClick={() => setShowErrorModal(false)}
              >
                예
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingInputPage;
