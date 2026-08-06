import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button, Toast } from '@/shared/components';
import { updateAccountSettings } from '@/features/auth/api/userApi';
import { useToast } from '@/shared/hooks/useToast';

const inputClassName =
  'h-[52px] w-full rounded-[8px] border border-[#E2E6E8] px-[16px] text-[15px] text-[#111111] outline-none focus:border-[#00AAFF]';

const SettlementAccountPage = () => {
  const navigate = useNavigate();
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();

  const updateSettingsMutation = useMutation({ mutationFn: updateAccountSettings });

  const isValid =
    bankName.trim() !== '' && accountNumber.trim() !== '' && accountHolder.trim() !== '';

  const handleSave = () => {
    if (!isValid) return;
    updateSettingsMutation.mutate(
      {
        settlementAccount: {
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          accountHolder: accountHolder.trim(),
        },
      },
      {
        onSuccess: () => showToast('정산 계좌가 저장되었습니다'),
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
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">정산 계좌 관리</h1>
      </header>

      <div className="flex flex-col gap-4 px-[16px] py-[24px]">
        <p className="text-[13px] leading-[1.5] text-[#767676]">
          현재 등록된 계좌 확인은 준비 중입니다. 아래에 새 계좌 정보를 입력해 저장할 수 있어요.
        </p>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#767676]">은행명</label>
          <input
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            placeholder="은행명을 입력해주세요"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#767676]">계좌번호</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="계좌번호를 입력해주세요"
            className={inputClassName}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[13px] text-[#767676]">예금주</label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            placeholder="예금주를 입력해주세요"
            className={inputClassName}
          />
        </div>
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

export default SettlementAccountPage;
