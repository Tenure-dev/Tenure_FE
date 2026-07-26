import type { ItemHistoryEntry } from '../model/items';

const HistoryCard = ({ entry }: { entry: ItemHistoryEntry }) => {
  const dateRange = `${entry.dateFrom} ~ ${entry.dateTo ?? '현재'}`;

  return (
    <div className="bg-bg-white flex h-[310px] flex-col gap-3 rounded-xl p-4 shadow-sm">
      <div className="bg-gray-bg size-12 overflow-hidden rounded-full">
        <img src={entry.profileImageUrl} alt={entry.username} className="size-full object-cover" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-title-4 text-text-primary font-medium">{entry.username}</span>
        <span className="text-body-2 text-text-tertiary">{dateRange}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="bg-bg-quaternary text-body-3 text-text-secondary rounded-lg px-2 py-1">
          OOTD 인증 {entry.ootdCount}회
        </span>
        {entry.isFirstOwner && (
          <span className="bg-bg-quaternary text-body-3 text-text-secondary rounded-lg px-2 py-0.5">
            최초 등록
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {entry.ootdImages.map((src, i) => (
          <div key={i} className="bg-gray-bg h-24 w-16 overflow-hidden rounded-md">
            <img src={src} alt="" className="size-full object-cover" />
          </div>
        ))}
      </div>
      <button
        type="button"
        className="bg-gray-bg text-body-2 font-regular text-text-primary mt-auto w-full rounded-full py-2"
      >
        더보기
      </button>
    </div>
  );
};

export default HistoryCard;
