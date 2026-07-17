import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import type { OotdItem, WearTarget } from '@/features/ootd/model/item';

type Props = {
  onBack: () => void;
  onRegister: (item: OotdItem) => void;
};

const TARGETS: WearTarget[] = ['남성복', '여성복', '공용'];

const Label = ({ children }: { children: string }) => (
  <label className="text-body-3 mb-1.5 block font-medium">
    {children} <span className="text-error">*</span>
  </label>
);

// 공용 Input(lucide 의존) 대신 일반 입력 필드 + clear 버튼
const TextField = ({
  value,
  onChange,
  placeholder,
  leftIcon,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  leftIcon?: string;
}) => (
  <div className="bg-bg-secondary flex h-[54px] w-full items-center gap-2 rounded-md px-4">
    {leftIcon && <img src={leftIcon} width={20} height={20} alt="" className="shrink-0" />}
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="placeholder:text-text-tertiary flex-1 bg-transparent text-[16px] outline-none"
    />
    {value && (
      <button type="button" onClick={() => onChange('')} aria-label="지우기" className="shrink-0">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M6 6l8 8M14 6l-8 8" stroke="#767676" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    )}
  </div>
);

const NewItemSheet = ({ onBack, onRegister }: Props) => {
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [target, setTarget] = useState<WearTarget>('남성복');
  const [date, setDate] = useState('');

  const canSubmit = brand.trim() !== '' && name.trim() !== '';

  const handleRegister = () => {
    if (!canSubmit) return;
    onRegister({
      id: `new-${Date.now()}`,
      brand: brand.trim(),
      name: name.trim(),
      meta: '신규 아이템',
      isNew: true,
    });
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-end bg-black/30">
      <div className="bg-bg-white max-h-[88%] overflow-y-auto rounded-t-2xl px-5 pt-3 pb-6">
        <div className="mb-2 flex justify-center">
          <span className="bg-bg-secondary h-1 w-10 rounded-full" />
        </div>
        <h2 className="text-title-2 mb-5 font-semibold">새 아이템 등록</h2>

        <div className="mb-4">
          <Label>브랜드명</Label>
          <TextField value={brand} onChange={setBrand} placeholder="브랜드명을 입력하세요." />
        </div>

        <div className="mb-4">
          <Label>제품명</Label>
          <TextField value={name} onChange={setName} placeholder="제품명을 입력하세요." />
        </div>

        <div className="mb-4">
          <Label>착용 대상</Label>
          <div className="flex gap-3">
            {TARGETS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTarget(t)}
                className={cn(
                  'bg-bg-white text-body-3 h-11 rounded-sm border-[1.5px] px-6 font-medium',
                  target === t
                    ? 'border-border-primary text-text-primary'
                    : 'border-border-secondary text-text-secondary',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-body-3 mb-1.5 block font-medium">최초 보유 날짜</label>
          <TextField value={date} onChange={setDate} placeholder="ex. 26.03.04" />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-bg text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
          >
            뒤로 가기
          </button>
          <button
            type="button"
            onClick={handleRegister}
            disabled={!canSubmit}
            className={cn(
              'text-btn-2 flex-1 rounded-md py-3.5 font-medium',
              canSubmit ? 'bg-brand text-text-primary' : 'bg-disabled text-text-inverse',
            )}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewItemSheet;
