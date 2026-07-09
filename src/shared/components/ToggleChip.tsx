export interface ToggleChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

const ToggleChip = ({ label, selected, onToggle }: ToggleChipProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex h-[35px] w-[55px] items-center justify-center rounded-[12px] font-sans text-[14px] font-semibold ${
        selected ? 'bg-[#111111] text-[#FFFFFF]' : 'bg-[#EAEDF0] text-[#111111]'
      }`}
    >
      {label}
    </button>
  );
};

export default ToggleChip;
