export interface CTAButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const CTAButton = ({ label, onClick, disabled = false }: CTAButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-[32px] w-[166.5px] items-center justify-center font-sans text-[14px] font-semibold text-[#FFFFFF] ${
        disabled ? 'bg-[#CCEEFF]' : 'bg-[#00AAFF]'
      } ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default CTAButton;
