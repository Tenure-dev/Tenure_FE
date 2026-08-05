type Props = {
  thumbnail: string;
  brand: string;
  count: number;
  mode: 'offer' | 'intent';
  price?: number | null; // 판매중일 때 고정 판매가
};

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

const OfferProductInfo = ({ thumbnail, brand, count, mode, price }: Props) => (
  <section className="border-border-secondary border-b p-4">
    <h2 className="text-title-4 text-text-primary mb-3 font-semibold">상품 정보</h2>
    <div className="flex items-center gap-3">
      <img
        src={thumbnail}
        alt=""
        className="bg-bg-secondary size-20 shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0">
        <p className="text-body-1 text-text-primary truncate font-medium">{brand}</p>
        <p className="text-body-3 text-text-secondary mt-0.5">
          {mode === 'intent'
            ? `판매 상품${price != null ? ` · ${formatPrice(price)}` : ''}`
            : '미판매 상품'}
        </p>
        {mode === 'intent' ? (
          <span className="border-border-secondary text-body-4 text-text-primary mt-2 inline-block rounded-md border px-2 py-1 font-medium">
            거래 의사 총 {count}건
          </span>
        ) : (
          <span className="text-body-4 text-info mt-2 inline-block rounded-md bg-[#D7E6FF] px-2 py-1 font-medium">
            구매 제안 총 {count}건
          </span>
        )}
      </div>
    </div>
  </section>
);

export default OfferProductInfo;
