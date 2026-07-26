import { cn } from '@/shared/lib/cn';

export interface NotificationFilterChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

const NotificationFilterChip = ({ label, selected, onClick }: NotificationFilterChipProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'text-body-3 shrink-0 rounded-full px-4 py-2 font-semibold whitespace-nowrap',
      selected ? 'bg-bg-black text-text-inverse' : 'bg-gray-bg text-text-primary',
    )}
  >
    {label}
  </button>
);

export default NotificationFilterChip;
