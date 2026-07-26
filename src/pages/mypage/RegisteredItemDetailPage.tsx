import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BackHeader, Toast } from '@/shared/components';
import { edit } from '@/shared/assets';
import useToast from '@/shared/hooks/useToast';
import {
  ItemInfoSection,
  FrequentlyWornSection,
  ItemHistorySection,
  ItemEditSheet,
} from '@/features/mypage/ui';
import { useItemDetailQuery } from '@/features/mypage/model/useItemDetailQuery';
import { useUpdateItemMutation } from '@/features/mypage/model/useUpdateItemMutation';
import type { RegisteredItemDetail } from '@/features/mypage/model/items';

const RegisteredItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { data } = useItemDetailQuery(Number(itemId));
  const { mutate: updateItem } = useUpdateItemMutation(Number(itemId));
  const { message, show, hide } = useToast();
  const item: RegisteredItemDetail | undefined = data && {
    ...data,
    frequentlyWornWith: [],
    history: [],
  };
  const [allowProposal, setAllowProposal] = useState(false);
  const [syncedItemId, setSyncedItemId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  if (item && syncedItemId !== item.itemId) {
    setSyncedItemId(item.itemId);
    setAllowProposal(item.purchaseOfferEnabled);
  }

  if (!item) return null;

  const isForSale = item.itemStatus === 'ON_SALE';

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md pb-6">
      <BackHeader
        title={`${item.brandName} / ${item.itemName}`}
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
          {isForSale ? '판매 페이지로' : '공개 페이지로'}
        </button>
      </div>

      <ItemEditSheet
        open={editOpen}
        item={item}
        onClose={() => setEditOpen(false)}
        onApply={(body) =>
          updateItem(body, {
            onSuccess: () => show('아이템 정보가 수정됐습니다.'),
            onError: (error) => show(error.message),
          })
        }
      />
      <Toast message={message} onClose={hide} />
    </div>
  );
};

export default RegisteredItemDetailPage;
