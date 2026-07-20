import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, SelectBox } from '@/shared/components';
import { REPORT_REASONS } from '@/features/ootd/model/types';

const REPORT_OPTIONS = REPORT_REASONS.map((reason) => ({ value: reason, label: reason }));

const ReportPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    if (!reason) return;
    navigate(`/ootd/${id}`, { replace: true, state: { toast: '신고가 접수되었어요.' } });
  };

  return (
    <div className="bg-bg-white mx-auto flex min-h-screen w-full max-w-md flex-col">
      <div className="flex items-center gap-2 px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-text-primary" />
        </button>
        <h1 className="text-body-1 text-text-primary font-semibold">신고하기</h1>
      </div>

      <div className="flex-1 px-4 pt-4">
        <p className="text-body-2 text-text-primary mb-3 font-semibold">
          신고 사유를 선택해주세요.
        </p>
        <SelectBox
          options={REPORT_OPTIONS}
          value={reason}
          onChange={setReason}
          placeholder="골라주세요"
        />
      </div>

      <div className="flex justify-center px-4 pb-8">
        <Button disabled={!reason} onClick={handleSubmit} className="!w-full">
          신고하기
        </Button>
      </div>
    </div>
  );
};

export default ReportPage;
