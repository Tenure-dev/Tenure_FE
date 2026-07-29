import type { TradeDetailResponse } from '../api/types';

const TRADE_TIMELINE_LABELS = ['결제 완료', '상품 발송', '배송 완료', '구매 확정', '정산 완료'];

export interface TradeTimeline {
  steps: { label: string; date: string | null }[];
  currentStepIndex: number;
}

// createdAt(결제 완료 시점)부터 shippedAt/deliveredAt/confirmedAt/settledAt까지
// 채워진 timestamp 개수를 세어 현재 진행 단계를 계산한다. Trade는 결제 완료 이후에만
// 생성되므로 createdAt은 항상 존재하고, 그 뒤로는 timestamp가 순서대로 채워진다고 가정한다.
export const buildTradeTimeline = (
  trade: Pick<
    TradeDetailResponse,
    'createdAt' | 'shippedAt' | 'deliveredAt' | 'confirmedAt' | 'settledAt'
  >,
): TradeTimeline => {
  const dates: (string | null)[] = [
    trade.createdAt,
    trade.shippedAt,
    trade.deliveredAt,
    trade.confirmedAt,
    trade.settledAt,
  ];
  const steps = TRADE_TIMELINE_LABELS.map((label, index) => ({ label, date: dates[index] }));
  const currentStepIndex = dates.filter((date) => date !== null).length;

  return { steps, currentStepIndex };
};
