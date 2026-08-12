import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';
import { BackHeader, BottomSheet, ConfirmDialog, Toast } from '@/shared/components';
import { edit } from '@/shared/assets';
import useToast from '@/shared/hooks/useToast';
import {
  ItemInfoSection,
  FrequentlyWornSection,
  ItemHistorySection,
  ItemEditSheet,
} from '@/features/mypage/ui';
import { useItemDetailQuery } from '@/features/mypage/model/useItemDetailQuery';
import { useFrequentlyWornQuery } from '@/features/mypage/model/useFrequentlyWornQuery';
import { useUpdateItemMutation } from '@/features/mypage/model/useUpdateItemMutation';
import { useUpdateOfferSettingMutation } from '@/features/mypage/model/useUpdateOfferSettingMutation';
import { useDeleteItemMutation } from '@/features/mypage/model/useDeleteItemMutation';
import type { ItemDetail } from '@/features/mypage/model/items';

const ItemDetailPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { data } = useItemDetailQuery(Number(itemId));
  const { data: frequentlyWornWith = [] } = useFrequentlyWornQuery(Number(itemId));
  const { mutate: updateItem } = useUpdateItemMutation(Number(itemId));
  const { mutate: updateOfferSetting } = useUpdateOfferSettingMutation(Number(itemId));
  const { mutate: deleteItem } = useDeleteItemMutation();
  const navigate = useNavigate();
  const { message, show, hide } = useToast();
  const item: ItemDetail | undefined = data && {
    ...data,
    frequentlyWornWith,
  };
  const [allowProposal, setAllowProposal] = useState(false);
  const [syncedItemId, setSyncedItemId] = useState<number | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (item && syncedItemId !== item.itemId) {
    setSyncedItemId(item.itemId);
    setAllowProposal(item.purchaseOfferEnabled);
  }

  if (!item) return null;

  const myUserId = Number(localStorage.getItem('userId'));
  const isOwner = item.ownerUserId === myUserId;
  const isForSale = item.itemStatus === 'ON_SALE';

  const handleDeleteItem = () => {
    deleteItem(Number(itemId), {
      onSuccess: () => navigate('/mypage/items', { replace: true }),
      onError: (error) => {
        setDeleteDialogOpen(false);
        show(error.message);
      },
    });
  };

  const handleToggleProposal = () => {
    const next = !allowProposal;
    updateOfferSetting(
      { purchaseOfferEnabled: next },
      {
        onSuccess: () => {
          setAllowProposal(next);
          show(next ? '구매 제안이 허용되었습니다.' : '구매 제안이 차단되었습니다.');
          setActionSheetOpen(false);
        },
        onError: (error) => show(error.message),
      },
    );
  };

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md pb-6">
      <BackHeader
        title={`${item.brandName} / ${item.itemName}`}
        rightActions={
          isOwner ? (
            <div className="flex items-center gap-3">
              <button type="button" aria-label="수정" onClick={() => setEditOpen(true)}>
                <img src={edit} alt="" className="size-5" />
              </button>
              {!isForSale && (
                <button type="button" aria-label="더보기" onClick={() => setActionSheetOpen(true)}>
                  <MoreVertical className="size-5" />
                </button>
              )}
            </div>
          ) : undefined
        }
      />
      <ItemInfoSection item={item} allowProposal={allowProposal} />
      <FrequentlyWornSection items={item.frequentlyWornWith} />
      <ItemHistorySection itemId={item.itemId} />
      <div className="px-4 pt-1">
        <button
          type="button"
          disabled={!item.productId}
          onClick={() => navigate(`/product/${item.productId}`)}
          className="bg-text-primary text-body-1 font-regular text-text-inverse w-full rounded-sm py-3 disabled:opacity-40"
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

      {/* 이 바텀시트는 ItemMoreSheet 컴포넌트로 분리하기 */}
      <BottomSheet open={actionSheetOpen} onClose={() => setActionSheetOpen(false)} variant="menu">
        {!isForSale && (
          <button
            type="button"
            onClick={handleToggleProposal}
            className={`text-body-1 font-regular w-full py-3 text-center ${allowProposal ? 'text-text-primary' : 'text-info'}`}
          >
            {allowProposal ? '구매 제안 차단' : '구매 제안 허용'}
          </button>
        )}
        <button
          type="button"
          className="text-body-1 font-regular text-text-primary w-full py-3 text-center"
          onClick={() => navigate(`/items/${itemId}/sell`)}
        >
          판매 전환
        </button>
        <button
          type="button"
          className="text-body-1 font-regular w-full py-3 text-center text-red-500"
          onClick={() => {
            setActionSheetOpen(false);
            setDeleteDialogOpen(true);
          }}
        >
          아이템 삭제
        </button>
      </BottomSheet>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="아이템을 삭제할까요?"
        description="삭제된 아이템은 복구할 수 없습니다."
        confirmLabel="삭제"
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteItem}
      />

      <Toast message={message} onClose={hide} />
    </div>
  );
};

export default ItemDetailPage;
