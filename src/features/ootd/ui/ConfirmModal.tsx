import { Info } from 'lucide-react';
import { Modal, Button } from '@/shared/components';

export interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal = ({
  open,
  title,
  description,
  cancelLabel = '취소',
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="border-text-tertiary text-text-tertiary flex size-8 items-center justify-center rounded-full border">
          <Info size={16} />
        </span>
        <div>
          <h2 className="text-title-4 text-text-primary font-semibold">{title}</h2>
          <p className="text-body-3 text-text-secondary mt-1">{description}</p>
        </div>
        <div className="flex w-full gap-2.5">
          <Button variant="ghost" className="!w-1/2" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant="filled"
            className="!bg-text-primary !w-1/2 !text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
