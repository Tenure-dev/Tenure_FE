import { useParams, useNavigate } from 'react-router-dom';
import { BackHeader } from '@/shared/components';
import { useReceivedOffers } from '@/features/product/model/useReceivedOffers';
import OfferProductInfo from './component/OfferProductInfo';
import OfferCard from './component/OfferCard';

const ReceivedOffersPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { view, isLoading } = useReceivedOffers(Number(itemId));

  // mode로 갈라서 상세로 이동 (offer -> offerId, intent -> intentId. card.id에 각 값이 들어있음)
  const goDetail = (mode: 'offer' | 'intent', id: number) => {
    navigate(mode === 'offer' ? `/purchase/offer/${id}` : `/purchase/intent/${id}`);
  };

  return (
    <div className="bg-bg-white min-h-screen">
      <BackHeader title="받은 제안" />

      {isLoading && <p className="text-body-3 text-text-secondary p-4">불러오는 중...</p>}

      {view && (
        <>
          <OfferProductInfo
            thumbnail={view.product.thumbnail}
            brand={view.product.brand}
            count={view.count}
            mode={view.mode}
            price={view.product.price}
          />

          {view.cards.length === 0 ? (
            <p className="text-body-3 text-text-secondary p-4">
              아직 받은 {view.mode === 'intent' ? '거래 의사가' : '구매 제안이'} 없어요.
            </p>
          ) : (
            <ul className="flex flex-col gap-3 p-4">
              {view.cards.map((card) => (
                <li key={card.id}>
                  <OfferCard
                    avatar={card.avatar}
                    name={card.name}
                    price={card.price}
                    timeLeft={card.timeLeft}
                    mode={view.mode}
                    onClick={() => goDetail(view.mode, card.id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default ReceivedOffersPage;
