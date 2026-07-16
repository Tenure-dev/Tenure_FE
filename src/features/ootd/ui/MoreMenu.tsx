import type { ReactNode } from 'react';
import { Ban, Pencil, Flag, Trash2 } from 'lucide-react';
import { BottomSheet } from '@/shared/components';
import { cn } from '@/shared/lib/cn';

export interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
  isOwner: boolean;
  isBlocked: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onBlockToggle: () => void;
  onReport: () => void;
}

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: 'default' | 'danger';
}

const MenuItem = ({ icon, label, onClick, tone = 'default' }: MenuItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'border-border-secondary text-body-2 flex w-full items-center gap-2 border-t px-4 py-3.5 text-left font-medium first:border-t-0',
      tone === 'danger' ? 'text-error' : 'text-text-primary',
    )}
  >
    {icon}
    {label}
  </button>
);

const MoreMenu = ({
  open,
  onClose,
  isOwner,
  isBlocked,
  onEdit,
  onDelete,
  onBlockToggle,
  onReport,
}: MoreMenuProps) => {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="px-4 pb-5">
        <div className="border-border-secondary overflow-hidden rounded-xl border">
          {isOwner ? (
            <>
              <MenuItem icon={<Pencil size={16} />} label="수정하기" onClick={onEdit} />
              <MenuItem
                icon={<Trash2 size={16} />}
                label="삭제하기"
                onClick={onDelete}
                tone="danger"
              />
            </>
          ) : (
            <>
              <MenuItem
                icon={<Ban size={16} />}
                label={isBlocked ? '차단해제' : '차단하기'}
                onClick={onBlockToggle}
              />
              <MenuItem
                icon={<Flag size={16} />}
                label="신고하기"
                onClick={onReport}
                tone="danger"
              />
            </>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="border-border-secondary text-body-2 text-text-primary mt-2 h-[52px] w-full rounded-xl border font-semibold"
        >
          닫기
        </button>
      </div>
    </BottomSheet>
  );
};

export default MoreMenu;
