import { type ReactNode } from 'react';
import DoubleButton from './DoubleButton';

export interface ConfirmDialogProps {
  open: boolean;
  icon?: ReactNode;
  title: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDialog = ({
  open,
  icon,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-bg-white w-full max-w-[311px] rounded-xl p-6 text-center">
        {icon && <div className="mb-3 flex justify-center">{icon}</div>}
        <p className="text-title-4 text-text-primary">{title}</p>
        {description && <p className="text-body-3 text-text-secondary mt-2">{description}</p>}
        <div className="mt-5">
          <DoubleButton
            layout="half"
            leftLabel={cancelLabel}
            rightLabel={confirmLabel}
            onLeftClick={onCancel}
            onRightClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
