import { type ReactNode } from 'react';

export interface StatusChipProps {
  label: string;
  icon: ReactNode;
  active?: boolean;
}

const StatusChip = ({ label, icon, active = true }: StatusChipProps) => {
  const textClass = active ? 'text-text-primary' : 'text-text-disabled';

  return (
    <div
      className={`bg-gray-bg inline-flex h-[36px] w-[103.67px] items-center gap-1 rounded-[4px] px-2 font-sans text-[14px] font-medium ${textClass}`}
    >
      <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
};

export default StatusChip;
