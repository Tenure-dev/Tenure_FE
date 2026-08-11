import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button, Toast } from '@/shared/components';
import { updateAccountSettings } from '@/features/auth/api/userApi';
import { useToast } from '@/shared/hooks/useToast';

const inputClassName =
  'h-[52px] w-full rounded-[8px] border border-[#E2E6E8] px-[16px] text-[15px] text-[#111111] outline-none focus:border-[#00AAFF]';

const DefaultShippingFeePage = () => {
  const navigate = useNavigate();
  const [shippingFee, setShippingFee] = useState('');
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  const updateSettingsMutation = useMutation({ mutationFn: updateAccountSettings });

  const isValid = shippingFee.trim() !== '' && Number(shippingFee) >= 0;

  const handleSave = () => {
    if (!isValid) return;
    updateSettingsMutation.mutate(
      { defaultShippingFee: Number(shippingFee) },
      {
        onSuccess: () => showToast('기본 배송비가 저장되었습니다'),
        onError: (error) => {
          console.error(error);
          showToast('저장에 실패했습니다');
        },
      },
    );
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">기본 배송비</h1>
      </header>

      <div className="flex flex-col gap-2 px-[16px] py-[24px]">
        <p className="text-[13px] leading-[1.5] text-[#767676]">
          현재 설정된 기본 배송비는 조회할 수 없어요. 새 값을 입력해 저장하면 다음 상품 등록부터
          기본값으로 적용돼요.
        </p>
        <input
          type="number"
          min={0}
          value={shippingFee}
          onChange={(e) => setShippingFee(e.target.value)}
          placeholder="기본 배송비를 입력해주세요"
          className={`${inputClassName} mt-2`}
        />
      </div>

      <div className="px-[16px] py-[24px]">
        <Button
          variant="filled"
          size="54"
          className="!w-full"
          disabled={!isValid || updateSettingsMutation.isPending}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default DefaultShippingFeePage;
