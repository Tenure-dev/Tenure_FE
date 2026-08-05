import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button, DoubleButton } from '@/shared/components';
import { getAddresses } from '@/features/purchase/api/addressApi';
import { useDeleteAddress } from '@/features/purchase/model/useDeleteAddress';

const AddressManagePage = () => {
  const navigate = useNavigate();
  const { data: addresses = [], isPending } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  });
  const deleteMutation = useDeleteAddress();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const handleConfirmDelete = () => {
    if (deleteTargetId === null) return;
    deleteMutation.mutate(deleteTargetId, {
      onSuccess: () => setDeleteTargetId(null),
    });
  };

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <header className="flex h-[52px] items-center border-b border-[#F0F0F0] px-[16px]">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">배송지 관리</h1>
      </header>

      {isPending ? (
        <p className="px-[16px] py-[24px] text-center text-[13px] text-[#767676]">불러오는 중...</p>
      ) : addresses.length === 0 ? (
        <p className="px-[16px] py-[24px] text-center text-[13px] text-[#767676]">
          등록된 배송지가 없습니다.
        </p>
      ) : (
        addresses.map((address) => (
          <div key={address.addressId} className="border-b border-[#F0F0F0] p-[16px]">
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-[#111111]">{address.receiverName}</p>
              {address.isDefault && (
                <span className="rounded-[4px] bg-[#E5F6FF] px-[6px] py-[2px] text-[11px] font-medium text-[#00AAFF]">
                  기본 배송지
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] text-[#767676]">{address.phone}</p>
            <p className="mt-1 text-[13px] text-[#111111]">
              {address.postalCode && `[${address.postalCode}] `}
              {address.addressLine1} {address.addressLine2}
            </p>
            {address.requestNote && (
              <p className="mt-1 text-[12px] text-[#767676]">{address.requestNote}</p>
            )}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => navigate(`/settings/addresses/${address.addressId}/edit`)}
                className="text-[13px] text-[#00AAFF]"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => setDeleteTargetId(address.addressId)}
                className="text-[13px] text-[#767676]"
              >
                삭제
              </button>
            </div>
          </div>
        ))
      )}

      <div className="px-[16px] py-[24px]">
        <Button
          variant="ghost"
          size="54"
          className="!w-full"
          onClick={() => navigate('/settings/addresses/new')}
        >
          배송지 추가
        </Button>
      </div>

      {deleteTargetId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-[16px]">
          <div className="rounded-[12px] bg-white p-[24px]">
            <p className="text-center text-[16px] font-semibold text-[#111111]">
              이 배송지를 삭제할까요?
            </p>
            <p className="mt-[8px] text-center text-[13px] text-[#767676]">
              삭제한 배송지는 복구할 수 없습니다.
            </p>
            <div className="mt-[20px]">
              <DoubleButton
                layout="half"
                leftLabel="취소"
                rightLabel="삭제"
                onLeftClick={() => setDeleteTargetId(null)}
                onRightClick={handleConfirmDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManagePage;
