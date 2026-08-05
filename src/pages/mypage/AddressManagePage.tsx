import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { getAddresses } from '@/features/purchase/api/addressApi';

const AddressManagePage = () => {
  const navigate = useNavigate();
  const { data: addresses = [], isPending } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
  });

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
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
          </div>
        ))
      )}
    </div>
  );
};

export default AddressManagePage;
