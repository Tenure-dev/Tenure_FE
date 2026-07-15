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
      className={`text-text-inverse inline-flex h-[32px] w-[166.5px] items-center justify-center font-sans text-[14px] font-semibold ${
        disabled ? 'bg-brand-pale' : 'bg-brand'
      } ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      {label}
    </button>
  );
};

export default CTAButton;
