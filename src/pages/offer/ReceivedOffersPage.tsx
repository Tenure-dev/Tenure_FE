import { BackHeader } from '@/shared/components';
import OfferProductInfo from './component/OfferProductInfo';
import OfferCard from './component/OfferCard';

const MOCK_PRODUCT = {
  thumbnail: 'https://picsum.photos/seed/offer-product/200/200',
  brand: 'Levis / LVC 1955 501',
};

const MOCK_OFFERS = [
  {
    id: 1,
    name: '중고나라 속 보석',
    avatar: 'https://picsum.photos/seed/offer-1/120',
    price: 360000,
    timeLeft: '23시간 18분 남음',
  },
  {
    id: 2,
    name: '도윤마켓',
    avatar: 'https://picsum.photos/seed/offer-2/120',
    price: 345000,
    timeLeft: '15시간 23분 남음',
  },
  {
    id: 3,
    name: '지아 closet',
    avatar: 'https://picsum.photos/seed/offer-3/120',
    price: 285000,
    timeLeft: '9시간 4분 남음',
  },
  {
    id: 4,
    name: '수현룩',
    avatar: 'https://picsum.photos/seed/offer-4/120',
    price: 370000,
    timeLeft: '12시간 32분 남음',
  },
];

const ReceivedOffersPage = () => (
  <div className="bg-bg-white min-h-screen">
    <BackHeader title="받은 제안" />

    <OfferProductInfo
      thumbnail={MOCK_PRODUCT.thumbnail}
      brand={MOCK_PRODUCT.brand}
      count={MOCK_OFFERS.length}
    />

    <ul className="flex flex-col gap-3 p-4">
      {MOCK_OFFERS.map((offer) => (
        <li key={offer.id}>
          <OfferCard
            avatar={offer.avatar}
            name={offer.name}
            price={offer.price}
            timeLeft={offer.timeLeft}
            onClick={() => {}}
          />
        </li>
      ))}
    </ul>
  </div>
);

export default ReceivedOffersPage;
