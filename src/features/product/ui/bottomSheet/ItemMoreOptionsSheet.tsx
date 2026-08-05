import { useState } from 'react';
import { block, circleCheck, edit, report, stateChange, warning } from '@/shared/assets';
import { BottomSheet, ConfirmDialog } from '@/shared/components';
import type { ViewerRole } from '../../model/types';
import MenuRow from './MenuRow';

export interface ItemMoreOptionsSheetProps {
  open: boolean;
  onClose: () => void;
  role: ViewerRole;
  isBlocked: boolean;
  onToggleBlock: (nextBlocked: boolean) => void;
  onReport?: () => void;
  onEdit?: () => void;
  onMarkUnsold?: () => void;
  onMarkSoldOut?: () => void;
  onToast?: (message: string) => void;
}

const ItemMoreOptionsSheet = ({
  open,
  onClose,
  role,
  isBlocked,
  onToggleBlock,
  onReport,
  onEdit,
  onMarkUnsold,
  onMarkSoldOut,
  onToast,
}: ItemMoreOptionsSheetProps) => {
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
        {role === 'buyer' ? (
          <>
            <MenuRow
              icon={<img src={block} alt="" className="size-4" />}
              label={isBlocked ? '차단해제' : '차단하기'}
              onClick={handleBlockRowClick}
            />
            <MenuRow
              icon={<img src={report} alt="" className="size-4" />}
              label="신고하기"
              danger
              onClick={() => {
                onClose();
                onReport?.();
              }}
            />
          </>
        ) : (
          <>
            <MenuRow
              icon={<img src={edit} alt="" className="size-4" />}
              label="수정하기"
              onClick={() => {
                onClose();
                onEdit?.();
              }}
            />
            <MenuRow
              icon={<img src={stateChange} alt="" className="size-4" />}
              label="미판매로 변경하기"
              onClick={() => {
                onClose();
                onMarkUnsold?.();
              }}
            />
            <MenuRow
              icon={<img src={circleCheck} alt="" className="size-4" />}
              label="판매 완료로 변경하기"
              onClick={() => {
                onClose();
                onMarkSoldOut?.();
              }}
            />
          </>
        )}
      </BottomSheet>

      {/* 차단하기 시 다이얼로그 */}
      <ConfirmDialog
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

export default ItemMoreOptionsSheet;
