import { useState } from 'react';
import { formatDate } from '../lib/formatDate';
import { useUserProfileQuery } from '../model/useUserProfileQuery';
import { useHistoryOotdsQuery } from '../model/useHistoryOotdsQuery';
import type { ItemHistoryApiEntry } from '../model/items';
import HistoryOotdGrid from './HistoryOotdGrid';

const HistoryCard = ({ entry }: { entry: ItemHistoryApiEntry }) => {
  const { data: profile } = useUserProfileQuery(entry.ownerUserId);
  const { data: ootdsData } = useHistoryOotdsQuery(entry.itemId, entry.historyId, { size: 3 });
  const [gridOpen, setGridOpen] = useState(false);

  const previewImages = ootdsData?.content ?? [];
  const dateRange = `${formatDate(entry.startedAt)} ~ ${entry.endedAt ? formatDate(entry.endedAt) : '현재'}`;

  return (
    <>
      <div className="bg-bg-white flex h-[310px] flex-col gap-3 rounded-xl p-4 shadow-sm">
        <div className="bg-gray-bg size-12 overflow-hidden rounded-full">
          {profile?.profileImageUrl && (
            <img
              src={profile.profileImageUrl}
              alt={profile.username}
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-title-4 text-text-primary font-medium">
            {profile?.username ?? ''}
          </span>
          <span className="text-body-2 text-text-tertiary">{dateRange}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {entry.acquisitionType === 'FIRST_REGISTERED' && (
            <span className="bg-bg-quaternary text-body-3 text-text-secondary rounded-lg px-2 py-0.5">
              최초 등록
            </span>
          )}
          {entry.endReason === 'EXTERNAL_SALE' && (
            <span className="bg-bg-quaternary text-body-3 text-text-secondary rounded-lg px-2 py-0.5">
              외부 판매
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {previewImages.map((ootd) => (
            <div key={ootd.ootdId} className="bg-gray-bg h-24 w-16 overflow-hidden rounded-md">
              <img src={ootd.imageUrl} alt="" className="size-full object-cover" />
            </div>
          ))}
          {Array.from({ length: 3 - previewImages.length }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-bg h-24 w-16 rounded-md" />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setGridOpen(true)}
          className="bg-gray-bg text-body-2 font-regular text-text-primary mt-auto w-full rounded-full py-2"
        >
          더보기
        </button>
      </div>
      {gridOpen && (
        <HistoryOotdGrid
          itemId={entry.itemId}
          historyId={entry.historyId}
          onClose={() => setGridOpen(false)}
        />
      )}
    </>
  );
};

export default HistoryCard;
