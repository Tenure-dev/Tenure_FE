import { type ReactNode } from 'react';

type Props = {
  open: boolean;
  icon?: ReactNode;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
};

// 공용 ConfirmDialog를 타인 프로필용으로 복제 (확인 버튼을 검정으로).
// 공용 컴포넌트는 브랜드색이라 여기서만 별도로 둔다.
const BlockConfirmDialog = ({
  open,
  icon,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel,
  onCancel,
  onConfirm,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-bg-white w-full max-w-[311px] rounded-xl p-6 text-center">
        {icon && <div className="mb-3 flex justify-center">{icon}</div>}
        <p className="text-title-4 text-text-primary">{title}</p>
        {description && <p className="text-body-3 text-text-secondary mt-2">{description}</p>}
        <div className="mt-5 flex w-full gap-[10px]">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-bg text-btn-2 text-text-primary h-[54px] min-w-0 flex-1 rounded-sm font-semibold"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="bg-text-primary text-btn-2 h-[54px] min-w-0 flex-1 rounded-sm font-semibold text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockConfirmDialog;
