import { Check } from 'lucide-react';
import cn from '@/shared/lib/cn';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

const Checkbox = ({ checked, onChange, className }: CheckboxProps) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex size-5 items-center justify-center rounded-sm transition-colors',
        checked ? 'bg-brand' : 'bg-gray-bg',
        className,
      )}
    >
      {checked && <Check size={13} className="text-white" strokeWidth={2.5} />}
    </button>
  );
};

export default Checkbox;
