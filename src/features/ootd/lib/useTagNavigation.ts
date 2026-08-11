import { useNavigate } from 'react-router-dom';
import { getItemDetail } from '@/features/mypage/api/itemsApi';
import type { TaggedItem } from '@/features/ootd/model/types';

// 한 번이라도 판매/공개 전환된 적이 있는 아이템은 productId가 내려오므로 상품 상세로,
// 아예 등록만 되고 전환 이력이 없는 아이템(productId 없음)만 아이템 상세로 보낸다.
// 단, 게시물 작성자 본인이 보는 판매중/미판매 아이템은 상품 상세 대신 본인의 아이템
// 관리 상세(itemDetailPage)로 보낸다.
export const useTagNavigation = () => {
  const navigate = useNavigate();

  const goToDetail = async (item: Pick<TaggedItem, 'itemId' | 'status'>, isOwner: boolean) => {
    if (
      isOwner &&
      (item.status === '판매중' ||
        item.status === '미판매_제안가능' ||
        item.status === '미판매_제안불가')
    ) {
      navigate(`/items/${item.itemId}`);
      return;
    }

    const detail = await getItemDetail(item.itemId);
    if (detail.productId) {
      navigate(`/product/${detail.productId}`);
    } else {
      navigate(`/product?itemId=${item.itemId}`);
    }
  };

  const goToCheckout = async (itemId: number) => {
    const detail = await getItemDetail(itemId);
    if (detail.productId) navigate(`/product/${detail.productId}/purchase/checkout`);
  };

  const goToOffer = (itemId: number) => {
    navigate(`/product/${itemId}/offer/price`);
  };

  return { goToDetail, goToCheckout, goToOffer };
};
