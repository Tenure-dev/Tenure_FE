import { useParams } from 'react-router-dom';
import { BackHeader } from '@/shared/components';
import { useProductDetail } from '@/features/product/model/useProductDetail';
import { useItemOotdCandidatesQuery } from '@/features/mypage/model/useItemOotdCandidatesQuery';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';

const OotdGridPage = () => {
  const { productId = '', itemId = '' } = useParams();
  const isItemMode = !!itemId && !productId;

  const { data: productData } = useProductDetail(isItemMode ? NaN : Number(productId));
  const { data: itemOotdData } = useItemOotdCandidatesQuery(
    Number(itemId),
    { size: 50 },
    { enabled: isItemMode },
  );

  const images = isItemMode
    ? (itemOotdData?.content ?? []).map((o) => ({ ootdId: o.ootdId, imageUrl: resolveImageUrl(o.imageUrl) }))
    : (productData?.representativeOotds ?? []).map((o) => ({
        ootdId: o.ootdId,
        imageUrl: resolveImageUrl(o.imageUrl),
      }));

  return (
    <div className="bg-bg-secondary flex min-h-screen flex-col">
      <BackHeader title={isItemMode ? '태그된 OOTD' : '대표 OOTD'} />
      <div className="columns-2 gap-0.5 px-0.5 pt-0.5 pb-4">
        {images.map((ootd) => (
          <div key={ootd.ootdId} className="mb-0.5 overflow-hidden">
            <img src={ootd.imageUrl} alt="" className="w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OotdGridPage;
