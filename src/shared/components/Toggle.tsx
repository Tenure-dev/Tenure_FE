import cn from '@/shared/lib/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle = ({ checked, onChange }: ToggleProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-6 w-11 rounded-full transition-colors duration-200',
        checked ? 'bg-brand-secondary' : 'bg-gray-bg',
      )}
    >
      <span
        className={cn(
          'absolute top-0 left-0 size-6 rounded-full border-[2.5px] bg-white transition-transform duration-200',
          checked ? 'border-brand translate-x-[20px]' : 'border-text-secondary translate-x-0',
        )}
      />
    </button>
  );
};

export default Toggle;
