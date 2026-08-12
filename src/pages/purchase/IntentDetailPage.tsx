import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useIntentDetail } from '@/features/purchase/model/useIntentDetail';
import { useIntentAction } from '@/features/purchase/model/useIntentAction';
import ProposalDetailContent from './components/ProposalDetailContent';

const MessageScreen = ({ message, onBack }: { message: string; onBack: () => void }) => (
  <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col bg-[#FFFFFF] font-sans">
    <div className="flex h-[52px] items-center px-[16px]">
      <button type="button" onClick={onBack} aria-label="뒤로가기">
        <ChevronLeft size={24} className="text-[#111111]" />
      </button>
    </div>
    <div className="flex flex-1 items-center justify-center px-[16px] text-center text-[13px] text-[#767676]">
      {message}
    </div>
  </div>
);

const IntentDetailPage = () => {
  const { intentId = '' } = useParams();
  const navigate = useNavigate();
  const intentIdNum = Number(intentId);
  const isValidId = intentId !== '' && Number.isFinite(intentIdNum) && intentIdNum > 0;

  const { data, isPending, isError } = useIntentDetail(isValidId ? intentIdNum : 0);
  const { mutate, isPending: isMutating } = useIntentAction(intentIdNum);

  const handleBack = () => navigate(-1);

  if (!isValidId) {
    return <MessageScreen message="제안 정보를 찾을 수 없습니다." onBack={handleBack} />;
  }
  if (isPending) {
    return <MessageScreen message="불러오는 중..." onBack={handleBack} />;
  }
  if (isError || !data) {
    return <MessageScreen message="제안 정보를 불러오지 못했습니다." onBack={handleBack} />;
  }

  const isBuyer = data.viewerRole === 'BUYER';
  const counterpart = isBuyer ? data.seller : data.buyer;
  const title = isBuyer
    ? `${data.seller.username} 님에게 거래 의사를 보냈습니다!`
    : `${data.buyer.username} 님이 거래 의사를 보냈습니다!`;

  return (
    <ProposalDetailContent
      proposalType="PURCHASE_INTENT"
      isBuyer={isBuyer}
      title={title}
      status={data.status}
      remainingSeconds={data.remainingSeconds}
      itemId={data.product.itemId}
      itemNavigationPath={`/product/${data.product.productId}`}
      brandName={data.product.brandName}
      itemName={data.product.itemName}
      imageUrl={data.product.imageUrl}
      productPrice={data.amounts.productAmount}
      amounts={data.amounts}
      counterpart={counterpart}
      delivery={data.delivery}
      deliveryDisclosureStatus={data.deliveryDisclosureStatus}
      tradeRequestNote={data.tradeRequestNote}
      paymentMethodId={data.paymentMethodId}
      onAccept={() =>
        mutate('ACCEPT', {
          onSuccess: (result) => {
            const res = result as { tradeId: number } | void;
            if (res && 'tradeId' in res) {
              navigate(`/trade/${res.tradeId}`);
            } else {
              handleBack();
            }
          },
        })
      }
      onReject={() => mutate('REJECT', { onSuccess: handleBack })}
      onCancel={() => mutate('CANCEL', { onSuccess: handleBack })}
      isMutating={isMutating}
    />
  );
};

export default IntentDetailPage;
