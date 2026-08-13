import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useOfferDetail } from '@/features/purchase/model/useOfferDetail';
import { useOfferAction } from '@/features/purchase/model/useOfferAction';
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

const OfferDetailPage = () => {
  const { offerId = '' } = useParams();
  const navigate = useNavigate();
  const offerIdNum = Number(offerId);
  const isValidId = offerId !== '' && Number.isFinite(offerIdNum) && offerIdNum > 0;

  const { data, isPending, isError } = useOfferDetail(isValidId ? offerIdNum : 0);
  const { mutate, isPending: isMutating } = useOfferAction(offerIdNum);

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

  const isBuyer = data.viewerRole === 'PROPOSER';
  const counterpart = isBuyer ? data.owner : data.proposer;
  const title = isBuyer
    ? `${data.owner.username} 님에게 구매 제안을 보냈습니다!`
    : `${data.proposer.username} 님이 구매 제안을 보냈습니다!`;

  // offer 상세 금액은 필드명이 달라(offerAmount/proposerServiceFee/…) 공통 컴포넌트 형태로 변환.
  // 판매자 수수료는 응답에 없어 (제안가 - 정산액)으로 계산. 정산액은 판매자 뷰에서만 내려온다.
  const {
    offerAmount,
    shippingFee,
    proposerServiceFee,
    totalPaymentAmount,
    ownerSettlementAmount,
  } = data.amounts;
  const amounts = {
    productAmount: offerAmount,
    shippingFee,
    buyerServiceFee: proposerServiceFee,
    sellerServiceFee: ownerSettlementAmount != null ? offerAmount - ownerSettlementAmount : 0,
    buyerPaymentAmount: totalPaymentAmount,
    sellerSettlementAmount: ownerSettlementAmount ?? 0,
  };

  return (
    <ProposalDetailContent
      proposalType="OFFER"
      isBuyer={isBuyer}
      title={title}
      status={data.status}
      remainingSeconds={data.remainingSeconds}
      itemId={data.item.itemId}
      purchaseOfferId={offerIdNum}
      itemNavigationPath={`/items/${data.item.itemId}`}
      brandName={data.item.brandName}
      itemName={data.item.itemName}
      imageUrl={null}
      amounts={amounts}
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

export default OfferDetailPage;
