import { useState } from 'react';
import { block, warning } from '@/shared/assets';
import { BottomSheet } from '@/shared/components';
import cn from '@/shared/lib/cn';
import BlockConfirmDialog from './BlockConfirmDialog';

type Props = {
  open: boolean;
  onClose: () => void;
  isBlocked: boolean;
  onToggleBlock: (nextBlocked: boolean) => void;
  onToast?: (message: string) => void;
};

// 타인 프로필 더보기 — 차단하기만 제공 (아이템 상세의 차단 디자인과 동일)
const UserMoreSheet = ({ open, onClose, isBlocked, onToggleBlock, onToast }: Props) => {
  const [showBlockConfirm, setShowBlockConfirm] = useState(false);

  const handleBlockRowClick = () => {
    if (isBlocked) {
      onToggleBlock(false);
      onClose();
      onToast?.('이 사용자의 게시글을 다시 볼 수 있어요.');
      return;
    }
    setShowBlockConfirm(true);
  };

  const handleConfirmBlock = () => {
    onToggleBlock(true);
    setShowBlockConfirm(false);
    onClose();
    onToast?.('이 사용자의 게시글이 더 이상 표시되지 않아요.');
  };

  return (
    <>
      <BottomSheet open={open && !showBlockConfirm} onClose={onClose}>
        <button
          type="button"
          onClick={handleBlockRowClick}
          className="flex w-full items-center gap-3 px-4 py-3.5"
        >
          <img src={block} alt="" className="size-4" />
          <span className={cn('text-body-1 font-regular text-text-primary translate-y-0.25')}>
            {isBlocked ? '차단해제' : '차단하기'}
          </span>
        </button>
      </BottomSheet>

      <BlockConfirmDialog
        open={showBlockConfirm}
        icon={<img src={warning} alt="" className="size-9" />}
        title="이 사용자를 차단할까요?"
        description="이 사용자의 게시글이 더 이상 표시되지 않아요."
        confirmLabel="차단하기"
        onCancel={() => setShowBlockConfirm(false)}
        onConfirm={handleConfirmBlock}
      />
    </>
  );
};

export default UserMoreSheet;
