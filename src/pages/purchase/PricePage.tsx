import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Delete } from 'lucide-react';
import { BackHeader, Button } from '@/shared/components';
import { useItemDetailQuery } from '@/features/mypage/model/useItemDetailQuery';
import { useUserQuery } from '@/features/user/model/useUserQuery';
import { useOfferStore } from '@/store/offerStore';
import { cn } from '@/shared/lib/cn';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import StepProgress from './components/StepProgress';
import ItemSummaryCard from './components/ItemSummaryCard';

type View = 'form' | 'numpad';

const NUMPAD_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '←'];

const PricePage = () => {
  const { itemId = '' } = useParams();
  const navigate = useNavigate();
  const setItemId = useOfferStore((s) => s.setItemId);
  const setPrice = useOfferStore((s) => s.setPrice);
  const setSellerNickname = useOfferStore((s) => s.setSellerNickname);

  const { data, isLoading, isError } = useItemDetailQuery(Number(itemId));
  const { data: ownerData } = useUserQuery(data?.ownerUserId ?? 0, {
    enabled: !!data?.ownerUserId,
  });

  const [view, setView] = useState<View>('form');
  const [digits, setDigits] = useState('');

  if (isLoading) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        로딩 중...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-bg-white text-body-3 text-text-secondary flex min-h-screen items-center justify-center">
        아이템 정보를 찾을 수 없습니다.
      </div>
    );
  }

  const price = parseInt(digits || '0', 10);
  const sellerNickname = ownerData?.username ?? '';

  const handleKey = (key: string) => {
    if (key === '←') {
      setDigits((prev) => prev.slice(0, -1));
      return;
    }
    if (digits === '' && (key === '0' || key === '00')) return;
    if (digits.length + key.length > 9) return;
    setDigits((prev) => prev + key);
  };

  const handleConfirmNumpad = () => setView('form');

  const handleSubmit = () => {
    setItemId(data.itemId);
    setPrice(price);
    setSellerNickname(sellerNickname);
    navigate(`/product/${itemId}/offer/checkout`, { replace: true });
  };

  if (view === 'numpad') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <BackHeader title="구매 제안" onBack={handleConfirmNumpad} />

        <StepProgress currentStep={1} />

        <div className="flex flex-1 flex-col px-4 pt-8">
          <p className="text-body-1 text-text-secondary">
            <span className="text-text-primary font-bold">{sellerNickname}</span>님에게
          </p>
          <p className="text-title-1 text-text-secondary mt-1">얼마를 제안할까요?</p>

          <div className="mt-10 text-center">
            <span className="text-headline-2 text-text-primary font-bold">
              {price > 0 ? price.toLocaleString('ko-KR') : '0'}원
            </span>
          </div>
        </div>

        {price > 0 && (
          <button
            type="button"
            onClick={handleConfirmNumpad}
            className="bg-brand text-btn-1 h-[54px] w-full font-semibold text-white"
          >
            다음
          </button>
        )}

        <div className="border-border border-t">
          <div className="grid grid-cols-3">
            {NUMPAD_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                className="active:bg-bg-secondary flex h-[60px] items-center justify-center"
              >
                {key === '←' ? (
                  <Delete size={22} className="text-text-primary" />
                ) : (
                  <span className="text-text-primary text-[22px] font-medium">{key}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
      <BackHeader title="구매 제안" />
      <StepProgress currentStep={1} />

      <ItemSummaryCard
        imageUrl={resolveImageUrl(data.representativeImageUrl)}
        brand={data.brandName}
        name={data.itemName}
        sellerNickname={sellerNickname}
        subline={`미판매 · OOTD 인증 ${data.ootdVerifiedWearCount}회`}
      />

      <div className="flex flex-1 flex-col px-4 pt-6">
        <h2 className="text-title-2 text-text-primary mb-1 font-bold">제안 가격</h2>
        <p className="text-body-3 text-text-secondary mb-4">
          판매 중이 아닌 패션 아이템에 <strong>1회만</strong> 구매 의사를 보낼 수 있어요.
        </p>

        <button
          type="button"
          onClick={() => setView('numpad')}
          className={cn(
            'bg-bg-quaternary text-body-1 w-full rounded-xl p-4 text-left',
            price > 0 ? 'text-text-primary' : 'text-text-secondary',
          )}
        >
          {price > 0 ? `${price.toLocaleString('ko-KR')}원` : '제안하고 싶은 가격 입력'}
        </button>

        <p className="text-body-3 text-warning mt-3">
          제안이 수락되는 즉시 상품이 구매 처리되며, 이후 거래가 진행됩니다.
        </p>
      </div>

      <div className="px-4 py-3">
        <Button
          variant="filled"
          size="54"
          className="!w-full"
          disabled={price === 0}
          onClick={handleSubmit}
        >
          제안하기
        </Button>
      </div>
    </div>
  );
};

export default PricePage;
