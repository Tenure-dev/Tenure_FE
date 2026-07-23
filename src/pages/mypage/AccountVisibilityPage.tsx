import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronLeft } from 'lucide-react';

type Visibility = 'PUBLIC' | 'PRIVATE';

interface VisibilityOption {
  key: Visibility;
  label: string;
  description: string;
}

const VISIBILITY_OPTIONS: VisibilityOption[] = [
  {
    key: 'PUBLIC',
    label: '전체 공개',
    description: '누구나 내 프로필과 OOTD를 볼 수 있어요.',
  },
  {
    key: 'PRIVATE',
    label: '비공개',
    description: '내가 팔로우를 승인한 사람만 볼 수 있어요.',
  },
];

const AccountVisibilityPage = () => {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<Visibility>('PUBLIC');

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">계정 공개 범위</h1>
      </header>

      {VISIBILITY_OPTIONS.map((option) => (
        <button
          key={option.key}
          type="button"
          onClick={() => setVisibility(option.key)}
          className="flex w-full items-start justify-between gap-3 border-b border-[#F0F0F0] p-[16px] text-left"
        >
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-semibold text-[#111111]">{option.label}</p>
            <p className="text-[12px] leading-[1.5] text-[#767676]">{option.description}</p>
          </div>
          <span
            className={`mt-[2px] flex size-[20px] shrink-0 items-center justify-center rounded-full border ${
              visibility === option.key
                ? 'border-[#00AAFF] bg-[#00AAFF]'
                : 'border-[#E2E6E8] bg-white'
            }`}
          >
            {visibility === option.key && <Check size={13} className="text-white" />}
          </span>
        </button>
      ))}
    </div>
  );
};

export default AccountVisibilityPage;
