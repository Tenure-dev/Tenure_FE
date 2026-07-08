export type FeeChipValue = '판매자 부담' | '구매자 부담' | '반반 부담';

export interface FeeChipProps {
  value: FeeChipValue;
  onChange: (value: FeeChipValue) => void;
}

const FEE_OPTIONS: FeeChipValue[] = ['판매자 부담', '구매자 부담', '반반 부담'];

const FeeChip = ({ value, onChange }: FeeChipProps) => {
  return (
    <div className="flex gap-[10px]">
      {FEE_OPTIONS.map((option) => {
        const isSelected = value === option;

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`inline-flex h-[40px] w-[103px] items-center justify-center rounded-[16px] font-sans text-[14px] font-semibold ${
              isSelected ? 'bg-[#111111] text-[#FFFFFF]' : 'bg-[#E2E6E8] text-[#111111]'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default FeeChip;
