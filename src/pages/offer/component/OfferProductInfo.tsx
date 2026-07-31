type Props = {
  thumbnail: string;
  brand: string;
  count: number;
};

const OfferProductInfo = ({ thumbnail, brand, count }: Props) => (
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
        <p className="text-body-3 text-text-secondary mt-0.5">미판매 상품</p>
        <span className="text-body-4 text-info mt-2 inline-block rounded-md bg-[#D7E6FF] px-2 py-1 font-medium">
          구매 제안 총 {count}건
        </span>
      </div>
    </div>
  </section>
);

export default OfferProductInfo;
