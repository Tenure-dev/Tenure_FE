import { ChevronLeft } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface EditHeaderProps {
  changeCount: number;
  canComplete: boolean; // 변경 있음 + 태그 최소 1개 (빈 목록은 저장 불가)
  onCancel: () => void;
  onComplete: () => void;
}

const EditHeader = ({ changeCount, canComplete, onCancel, onComplete }: EditHeaderProps) => {
  return (
    <div className="bg-bg-white sticky top-0 z-30 flex items-center justify-between px-4 py-3">
      <button type="button" onClick={onCancel} aria-label="취소">
        <ChevronLeft size={24} className="text-text-primary" />
      </button>
      <h1 className="text-body-1 text-text-primary font-semibold">태그 수정</h1>
      <button
        type="button"
        disabled={!canComplete}
        onClick={onComplete}
        className={cn(
          'text-btn-3 font-semibold',
          canComplete ? 'text-brand' : 'text-text-disabled',
        )}
      >
        완료{changeCount > 0 ? `(${changeCount})` : ''}
      </button>
    </div>
  );
};

export default EditHeader;
