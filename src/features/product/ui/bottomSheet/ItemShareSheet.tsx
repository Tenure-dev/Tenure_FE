import { paperClip, moreOptions } from '@/shared/assets';
import { BottomSheet } from '@/shared/components';
import MenuRow from './MenuRow';

export interface ItemShareSheetProps {
  open: boolean;
  onClose: () => void;
  onCopyLink?: () => void;
  onShareToApp?: () => void;
}

const ItemShareSheet = ({ open, onClose, onCopyLink, onShareToApp }: ItemShareSheetProps) => {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <MenuRow
        icon={<img src={paperClip} alt="" className="size-4" />}
        label="링크 복사"
        onClick={() => {
          onClose();
          onCopyLink?.();
        }}
      />
      <MenuRow
        icon={<img src={moreOptions} alt="" className="size-3.5" />}
        label="다른 앱에 공유"
        onClick={() => {
          onClose();
          onShareToApp?.();
        }}
      />
    </BottomSheet>
  );
};

export default ItemShareSheet;
