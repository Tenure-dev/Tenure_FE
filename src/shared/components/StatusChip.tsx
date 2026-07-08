import { type ReactNode } from 'react';

export interface StatusChipProps {
  label: string;
  icon: ReactNode;
  active?: boolean;
}

const StatusChip = ({ label, icon, active = true }: StatusChipProps) => {
  const textClass = active ? 'text-[#111111]' : 'text-[#A3B6B8]';

  return (
    <div
      className={`inline-flex h-[36px] w-[103.67px] items-center gap-1 rounded-[4px] bg-[#EAEDF0] px-2 font-sans text-[14px] font-medium ${textClass}`}
    >
      <span className="inline-flex shrink-0 items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
};

export default StatusChip;
