import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { DoubleButton, Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import { ApiError } from '@/shared/lib/api';
import { useWithdraw } from '@/features/auth/api/useWithdraw';
import type { WithdrawalReason } from '@/features/auth/api/types';

const WITHDRAW_REASONS: { value: WithdrawalReason; label: string }[] = [
  { value: 'LOW_USAGE', label: '사용 빈도가 낮아요.' },
  { value: 'HARD_TO_FIND_ITEMS', label: '원하는 아이템을 찾기 어려워요.' },
  { value: 'USING_OTHER_SERVICE', label: '다른 서비스를 이용할 예정이에요.' },
  { value: 'UNSATISFIED_TRADE', label: '거래 경험이 만족스럽지 않았어요.' },
];

const WithdrawPage = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState<WithdrawalReason | ''>('');
  const [isOpen, setIsOpen] = useState(false);
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const { mutate: withdraw, isPending } = useWithdraw();

  const selectedLabel = WITHDRAW_REASONS.find((option) => option.value === reason)?.label;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">회원 탈퇴</h1>
      </header>

      <div className="flex-1 px-[16px] pt-[24px]">
        <p className="text-[18px] font-semibold text-[#111111]">
          Tenure를 떠나시는 이유를 알려주세요
        </p>

        <div className="relative mt-[20px]">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-[52px] w-full items-center justify-between rounded-[8px] border border-[#E2E6E8] bg-white px-[16px] text-[14px]"
          >
            <span className={reason ? 'text-[#111111]' : 'text-[#767676]'}>
              {selectedLabel ?? '이유를 선택해주세요'}
            </span>
            <ChevronDown size={18} className="text-[#767676]" />
          </button>
          {isOpen && (
            <div className="absolute top-[56px] left-0 z-10 w-full rounded-[8px] border border-[#E2E6E8] bg-white shadow-[0px_2px_12px_1px_rgba(0,0,0,0.09)]">
              {WITHDRAW_REASONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setReason(option.value);
                    setIsOpen(false);
                  }}
                  className="flex h-[44px] w-full items-center px-[16px] text-left text-[14px] text-[#111111]"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-[16px] py-[24px]">
        <DoubleButton
          layout="half"
          leftLabel="취소하기"
          rightLabel="회원탈퇴"
          onLeftClick={() => navigate(-1)}
          onRightClick={() => {
            if (reason === '' || isPending) return;
            withdraw(
              { reason },
              {
                onError: (error) => {
                  if (error instanceof ApiError && error.code === 'USER_NOT_FOUND') {
                    showToast('이미 처리된 요청입니다');
                    return;
                  }
                  showToast('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
                },
              },
            );
          }}
        />
      </div>

      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default WithdrawPage;
