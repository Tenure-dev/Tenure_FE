import { useEffect } from 'react';
import { BackHeader, CTAButton } from '@/shared/components';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

export interface OotdPickerViewProps {
  items: { id: number; imageUrl: string }[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  onConfirm: () => void;
  onBack: () => void;
}

const OotdPickerView = ({
  items,
  selectedIds,
  onToggle,
  onConfirm,
  onBack,
}: OotdPickerViewProps) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="bg-bg-white fixed inset-0 z-10 mx-auto flex max-w-[768px] flex-col">
      <BackHeader title="대표 OOTD (최대 5개)" onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-2">
        {items.length === 0 ? (
          <div className="flex min-h-[50vh] items-center justify-center py-20">
            <p className="text-body-2 text-text-tertiary">태그된 피드가 없습니다.</p>
          </div>
        ) : (
          <div className="columns-2 gap-2">
            {items.map((ootd) => {
              const selIdx = selectedIds.indexOf(ootd.id);
              const selected = selIdx !== -1;
              return (
                <div
                  key={ootd.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onToggle(ootd.id)}
                  onKeyDown={(e) => e.key === 'Enter' && onToggle(ootd.id)}
                  className="bg-gray-bg relative mb-2 aspect-[3/4] cursor-pointer break-inside-avoid overflow-hidden rounded-lg"
                >
                  <img
                    src={resolveImageUrl(ootd.imageUrl)}
                    alt=""
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                  {selected && (
                    <div className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/75">
                      <span className="text-body-3 font-semibold text-white">{selIdx + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="border-border-light border-t p-4">
        <CTAButton label="선택 완료" onClick={onConfirm} fullWidth />
      </div>
    </div>
  );
};

export default OotdPickerView;
