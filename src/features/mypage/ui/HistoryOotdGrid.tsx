import { BackHeader } from '@/shared/components';
import { useHistoryOotdsQuery } from '../model/useHistoryOotdsQuery';

interface Props {
  itemId: number;
  historyId: number;
  onClose: () => void;
}

const HistoryOotdGrid = ({ itemId, historyId, onClose }: Props) => {
  const { data } = useHistoryOotdsQuery(itemId, historyId, { size: 100 });
  const images = data?.content ?? [];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <BackHeader title="아이템 히스토리" onBack={onClose} />
      <div className="columns-2 gap-0.5 overflow-y-auto px-0.5 pb-4">
        {images.map((ootd) => (
          <div key={ootd.ootdId} className="mb-0.5 overflow-hidden">
            <img src={ootd.imageUrl} alt="" className="w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryOotdGrid;
