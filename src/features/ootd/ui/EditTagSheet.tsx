import { Plus, Search } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import type { ClosetItem } from '@/features/ootd/model/types';

export type EditTagTarget = { type: 'edit'; tagId: string } | { type: 'add' } | null;

export interface EditTagSheetProps {
  target: EditTagTarget;
  isAnalyzing?: boolean;
  closetItems: ClosetItem[];
  selectedClosetItemId: string | null;
  onSelectClosetItem: (item: ClosetItem) => void;
  onRegisterNewItem: () => void;
  onSubmit: () => void;
}

const EditTagSheet = ({
  target,
  isAnalyzing = false,
  closetItems,
  selectedClosetItemId,
  onSelectClosetItem,
  onRegisterNewItem,
  onSubmit,
}: EditTagSheetProps) => {
  const isAdd = target?.type === 'add';
  const submitLabel = isAdd ? '추가하기' : '수정하기';
  const canSubmit = target !== null && selectedClosetItemId !== null && !isAnalyzing;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {isAnalyzing ? (
        <div className="px-5 pt-3">
          <div className="bg-gray-bg h-14 w-full animate-pulse rounded-lg" />
          <div className="border-border-secondary mt-4 border-b" />
        </div>
      ) : target === null ? (
        <div className="px-5 pt-3">
          <p className="text-body-1 text-text-primary font-semibold">
            수정할 태그를 선택해 주세요.
          </p>
          <p className="text-body-3 text-text-tertiary mt-1">
            사진 속 태그를 누르면 연결된 아이템을 바꿀 수 있어요.
          </p>
          <div className="border-border-secondary mt-4 border-b" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden px-5">
          <div className="flex items-center justify-between pt-3">
            <h3 className="text-body-1 text-text-primary font-semibold">분석한 결과</h3>
            <Search size={18} className="text-text-tertiary" />
          </div>
          <p className="text-body-3 text-text-tertiary mt-1">
            유사한 아이템 {closetItems.length}개 찾았습니다.
          </p>
          <div className="border-border-secondary my-3 border-b" />

          <button
            type="button"
            onClick={onRegisterNewItem}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left"
          >
            <span className="border-border-secondary text-text-tertiary flex size-11 shrink-0 items-center justify-center rounded-full border border-dashed">
              <Plus size={18} />
            </span>
            <span className="text-body-2 text-text-secondary font-semibold">새 아이템 등록</span>
          </button>

          <p className="text-body-3 text-text-tertiary mb-2">기존 아이템</p>

          <ul className="flex-1 space-y-2 overflow-y-auto pb-3">
            {closetItems.map((item) => {
              const selected = item.id === selectedClosetItemId;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onSelectClosetItem(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left',
                      selected ? 'border-brand' : 'border-transparent',
                    )}
                  >
                    <img
                      src={item.imageUrl}
                      alt=""
                      className="bg-gray-bg size-11 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-2 text-text-primary truncate font-semibold">
                        {item.brand} / {item.name}
                      </p>
                      <p className="text-body-4 text-text-tertiary">
                        최근 착용 {item.lastWornDaysAgo}일 전 · OOTD 인증 {item.verifiedCount}회
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="px-5 pt-2 pb-5">
        <button
          type="button"
          disabled={!canSubmit}
          onClick={onSubmit}
          className={cn(
            'text-btn-2 h-[52px] w-full rounded-lg font-semibold',
            canSubmit ? 'bg-text-primary text-white' : 'bg-gray-bg text-text-disabled',
          )}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
};

export default EditTagSheet;
