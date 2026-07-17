import { Ban, Pencil, Flag, Trash2 } from 'lucide-react';
import { BottomSheet, MenuRow } from '@/shared/components';

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
    <BottomSheet open={open} onClose={onClose} className="max-w-md">
      {isOwner ? (
        <>
          <MenuRow icon={<Pencil size={16} />} label="수정하기" onClick={onEdit} />
          <MenuRow icon={<Trash2 size={16} />} label="삭제하기" danger onClick={onDelete} />
        </>
      ) : (
        <>
          <MenuRow
            icon={<Ban size={16} />}
            label={isBlocked ? '차단해제' : '차단하기'}
            onClick={onBlockToggle}
          />
          <MenuRow icon={<Flag size={16} />} label="신고하기" danger onClick={onReport} />
        </>
      )}
    </BottomSheet>
  );
};

export default MoreMenu;
