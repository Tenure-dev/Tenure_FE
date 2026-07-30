import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ITEM_REPORT_REASONS } from '@/features/item/model/types';
import { BackHeader, Button, SelectBox } from '@/shared/components';

const REPORT_OPTIONS = ITEM_REPORT_REASONS.map((reason) => ({ value: reason, label: reason }));

const ItemReportPage = () => {
  const navigate = useNavigate();
  const { itemId } = useParams<{ itemId: string }>();
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason) return;
    navigate(`/item/${itemId}`, { replace: true, state: { toast: '신고가 접수되었어요.' } });
  };

  return (
    <div className="bg-bg-white flex min-h-screen flex-col">
      <BackHeader title="신고하기" />

      <div className="flex-1 p-4">
        <div className="bg-bg-white rounded-xl p-4">
          <p className="text-title-3 text-text-primary mb-3 font-semibold">
            신고 사유를 선택해주세요.
          </p>
          <SelectBox
            options={REPORT_OPTIONS}
            value={reason}
            onChange={setReason}
            placeholder="골라주세요."
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 px-4 pt-2 pb-8">
        <Button disabled={!reason} onClick={handleSubmit} className="w-full">
          신고하기
        </Button>
      </div>
    </div>
  );
};

export default ItemReportPage;
