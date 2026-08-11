import { useQuery } from '@tanstack/react-query';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { getDaysAgo } from '@/features/mypage/lib/daysAgo';
import { getSimilarItems } from './similarItems';
import type { SimilarItemResponse } from './dto';
import type { OotdItem } from '../model/item';

// 추천 응답 → 태그 화면 아이템 추천 리스트용 OotdItem
const toOotdItem = (r: SimilarItemResponse): OotdItem => ({
  id: String(r.itemId),
  brand: r.brandName,
  name: r.itemName,
  thumbnail: resolveFileUrl(r.representativeImageUrl),
  meta: [
    r.lastWornAt ? `최근 착용 ${getDaysAgo(r.lastWornAt)}일 전` : '최근 착용일 없음',
    `OOTD 인증 : ${r.ootdVerifiedWearCount}회`,
  ].join(' · '),
  isNew: false,
  categoryName: r.categoryName,
});

// 태그 작성용 추천 아이템 목록 (OotdItem으로 변환해서 반환)
export const useSimilarItems = (ootdId?: number) =>
  useQuery({
    queryKey: ['similar-items', ootdId ?? null],
    queryFn: () => getSimilarItems(30, ootdId),
    select: (data) => data.map(toOotdItem),
  });
