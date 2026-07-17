export type ChipState = 'default' | 'press' | 'completion';

export interface ChipProps {
  label: string;
  state?: ChipState;
  onRemove?: () => void;
}

const stateClasses: Record<ChipState, string> = {
  default: 'bg-gray-bg text-text-primary',
  press: 'bg-gray-press text-text-primary',
  completion: 'bg-bg-black text-text-inverse',
};

const Chip = ({ label, state = 'default', onRemove }: ChipProps) => {
  return (
    <div
      className={`inline-flex h-[40px] w-[84px] items-center justify-center gap-1 rounded-full px-2 font-sans text-[14px] font-semibold ${stateClasses[state]}`}
    >
      <span className="truncate">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex shrink-0 items-center justify-center text-[12px] leading-none"
          aria-label={`${label} 제거`}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Chip;
