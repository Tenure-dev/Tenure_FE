import { BackHeader, CTAButton } from '@/shared/components';

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
}: OotdPickerViewProps) => (
  <div className="bg-bg-white mx-auto flex min-h-screen max-w-md flex-col">
    <BackHeader title="대표 OOTD (최대 5개)" onBack={onBack} />
    <div className="flex-1 overflow-y-auto p-2">
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
              className="relative mb-2 cursor-pointer break-inside-avoid overflow-hidden rounded-lg"
            >
              <img src={ootd.imageUrl} alt="" className="w-full object-cover" />
              {selected && (
                <div className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/75">
                  <span className="text-body-3 font-semibold text-white">{selIdx + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
    <div className="border-border-light border-t p-4">
      <CTAButton label="선택 완료" onClick={onConfirm} fullWidth />
    </div>
  </div>
);

export default OotdPickerView;
