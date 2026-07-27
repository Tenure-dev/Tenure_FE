interface ItemSummaryCardProps {
  imageUrl: string;
  brand: string;
  name: string;
  sellerNickname: string;
  subline: string;
}

const ItemSummaryCard = ({
  imageUrl,
  brand,
  name,
  sellerNickname,
  subline,
}: ItemSummaryCardProps) => (
  <div className="border-border flex items-center gap-3 border-b p-4">
    <img src={imageUrl} alt={name} className="size-16 rounded-lg object-cover" />
    <div className="flex flex-col gap-0.5">
      <p className="text-title-4 text-text-primary font-semibold">
        {brand} / {name}
      </p>
      <p className="text-body-3 text-text-secondary">판매자 : {sellerNickname}</p>
      <p className="text-body-3 text-text-secondary">{subline}</p>
    </div>
  </div>
);

export default ItemSummaryCard;
