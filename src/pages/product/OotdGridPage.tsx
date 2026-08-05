import { useParams } from 'react-router-dom';
import { BackHeader } from '@/shared/components';
import { useProductDetail } from '@/features/product/model/useProductDetail';

const OotdGridPage = () => {
  const { productId = '' } = useParams();
  const { data } = useProductDetail(Number(productId));
  const images = data?.representativeOotds ?? [];

  return (
    <div className="bg-bg-secondary flex min-h-screen flex-col">
      <BackHeader title="대표 OOTD" />
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
