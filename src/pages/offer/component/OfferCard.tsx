type Props = {
  avatar: string;
  name: string;
  price?: number | null; // offer 모드에서만 사용
  timeLeft: string;
  mode: 'offer' | 'intent';
  onClick?: () => void;
};

const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

const OfferCard = ({ avatar, name, price, timeLeft, mode, onClick }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className="border-border-secondary bg-bg-quaternary flex w-full items-center gap-3 rounded-xl border px-5 py-2 text-left"
  >
    <img
      src={avatar}
      alt=""
      className="bg-bg-secondary size-15 shrink-0 rounded-full object-cover"
    />
    <div className="min-w-0 flex-1">
      <p className="text-body-1 text-text-primary truncate font-medium">{name}</p>
      {mode === 'intent' ? (
        <p className="text-body-2 text-text-secondary mt-0.5 font-medium">거래 의사를 보냈어요.</p>
      ) : (
        <p className="mt-0.5">
          <span className="text-body-2 text-error font-medium">{formatPrice(price ?? 0)}</span>
          <span className="text-body-3 text-text-secondary"> 구매 제안</span>
        </p>
      )}
      <div className="text-body-4 text-text-tertiary mt-1 flex items-center gap-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 7.5V12l3 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{timeLeft}</span>
      </div>
    </div>
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-text-tertiary shrink-0"
    >
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

export default OfferCard;
