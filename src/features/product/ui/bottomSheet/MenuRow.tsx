import { type ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface MenuRowProps {
  icon: ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

const MenuRow = ({ icon, label, danger = false, onClick }: MenuRowProps) => (
  <button type="button" onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5">
    {icon}
    <span
      className={cn(
        'text-body-1 font-regular translate-y-0.25',
        danger ? 'text-error' : 'text-text-primary',
      )}
    >
      {label}
    </span>
  </button>
);

export default MenuRow;
