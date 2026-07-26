import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackHeader } from '@/shared/components';
import { edit } from '@/shared/assets';
import {
  ItemInfoSection,
  FrequentlyWornSection,
  ItemHistorySection,
  ItemEditSheet,
} from '@/features/mypage/ui';
import { registeredItemDetails } from './mock';

const RegisteredItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const item = registeredItemDetails[itemId ?? ''];
  const [allowProposal, setAllowProposal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  if (!item) return null;

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md pb-6">
      <BackHeader
        title={`${item.brand} / ${item.name}`}
        rightActions={
          <button type="button" aria-label="수정" onClick={() => setEditOpen(true)}>
            <img src={edit} alt="" className="size-5" />
          </button>
        }
      />
      <ItemInfoSection
        item={item}
        allowProposal={allowProposal}
        onToggleProposal={setAllowProposal}
      />
      <FrequentlyWornSection items={item.frequentlyWornWith} />
      <ItemHistorySection history={item.history} />
      <div className="px-4 pt-1">
        <button
          type="button"
          className="bg-text-primary text-body-1 font-regular text-text-inverse w-full rounded-sm py-3"
        >
          {item.forSale ? '판매 페이지로' : '공개 페이지로'}
        </button>
      </div>

      <ItemEditSheet
        open={editOpen}
        item={item}
        onClose={() => setEditOpen(false)}
        onApply={() => setEditOpen(false)}
      />
    </div>
  );
};

export default RegisteredItemDetailPage;
