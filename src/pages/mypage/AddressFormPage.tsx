import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search } from 'lucide-react';
import { useKakaoPostcodePopup, type Address as KakaoAddress } from 'react-daum-postcode';
import { Button } from '@/shared/components';
import { getAddresses, type Address } from '@/features/purchase/api/addressApi';
import { useCreateAddress } from '@/features/purchase/model/useCreateAddress';
import { useUpdateAddress } from '@/features/purchase/model/useUpdateAddress';

const PHONE_PATTERN = /^010-\d{4}-\d{4}$/;

const inputClassName =
  'h-[52px] w-full rounded-[8px] border border-[#E2E6E8] px-[16px] text-[15px] text-[#111111] outline-none focus:border-[#00AAFF]';

const FormHeader = ({ title, onBack }: { title: string; onBack: () => void }) => (
  <header className="flex h-[52px] items-center border-b border-[#F0F0F0] px-[16px]">
    <button type="button" onClick={onBack} aria-label="뒤로가기">
      <ChevronLeft size={24} className="text-[#111111]" />
    </button>
    <h1 className="ml-2 text-[15px] font-semibold text-[#111111]">{title}</h1>
  </header>
);

const AddressFormPage = () => {
  const navigate = useNavigate();
  const { addressId } = useParams();
  const isEditMode = addressId !== undefined;
  const addressIdNumber = Number(addressId);

  const { data: addresses, isPending } = useQuery({
    queryKey: ['addresses'],
    queryFn: getAddresses,
    enabled: isEditMode,
  });

  if (isEditMode && isPending) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
        <FormHeader title="배송지 수정" onBack={() => navigate(-1)} />
        <p className="px-[16px] py-[24px] text-center text-[13px] text-[#767676]">불러오는 중...</p>
      </div>
    );
  }

  const target = isEditMode ? addresses?.find((a) => a.addressId === addressIdNumber) : undefined;

  if (isEditMode && !target) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
        <FormHeader title="배송지 수정" onBack={() => navigate(-1)} />
        <p className="px-[16px] py-[24px] text-center text-[13px] text-[#767676]">
          배송지 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  return (
    <AddressForm
      addressId={isEditMode ? addressIdNumber : undefined}
      initial={target}
      onDone={() => navigate(-1)}
    />
  );
};

interface AddressFormProps {
  addressId?: number;
  initial?: Address;
  onDone: () => void;
}

const AddressForm = ({ addressId, initial, onDone }: AddressFormProps) => {
  const isEditMode = addressId !== undefined;

  const [receiverName, setReceiverName] = useState(initial?.receiverName ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [addressLine1, setAddressLine1] = useState(initial?.addressLine1 ?? '');
  const [postalCode, setPostalCode] = useState(initial?.postalCode ?? '');
  const [addressLine2, setAddressLine2] = useState(initial?.addressLine2 ?? '');
  const [requestNote, setRequestNote] = useState(initial?.requestNote ?? '');
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);

  const openPostcodePopup = useKakaoPostcodePopup();
  const handleAddressSearch = () => {
    openPostcodePopup({
      onComplete: (data: KakaoAddress) => {
        setAddressLine1(data.address);
        setPostalCode(data.zonecode);
      },
    });
  };

  const isPhoneValid = PHONE_PATTERN.test(phone);
  const isValid =
    receiverName.trim().length > 0 &&
    isPhoneValid &&
    addressLine1.length > 0 &&
    addressLine2.trim().length > 0;

  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress(addressId ?? -1);
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = () => {
    if (!isValid) return;
    const payload = {
      receiverName: receiverName.trim(),
      phone,
      addressLine1,
      addressLine2: addressLine2.trim(),
      postalCode,
      requestNote: requestNote.trim(),
      isDefault,
    };

    if (isEditMode) {
      updateMutation.mutate(payload, { onSuccess: onDone });
    } else {
      createMutation.mutate(payload, { onSuccess: onDone });
    }
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[390px] bg-[#FFFFFF] font-sans">
      <FormHeader title={isEditMode ? '배송지 수정' : '배송지 추가'} onBack={onDone} />

      <div className="flex flex-col gap-[16px] px-[16px] py-[24px]">
        <input
          type="text"
          value={receiverName}
          onChange={(e) => setReceiverName(e.target.value)}
          placeholder="받는 사람 이름을 입력해주세요"
          className={inputClassName}
        />

        <div className="flex flex-col gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="연락처를 입력해주세요 (010-1234-5678)"
            className={inputClassName}
          />
          {phone.length > 0 && !isPhoneValid && (
            <p className="text-[13px] text-[#FF3B30]">
              연락처 형식이 올바르지 않습니다 (010-0000-0000)
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddressSearch}
          className={`relative flex items-center ${inputClassName} pl-[44px] text-left`}
        >
          <Search
            size={18}
            className="absolute top-1/2 left-[14px] -translate-y-1/2 text-[#767676]"
          />
          {addressLine1 ? (
            <span className="text-[#111111]">
              [{postalCode}] {addressLine1}
            </span>
          ) : (
            <span className="text-[#767676]">도로명, 지번, 건물명으로 검색</span>
          )}
        </button>

        <input
          type="text"
          value={addressLine2}
          onChange={(e) => setAddressLine2(e.target.value)}
          placeholder="상세 주소를 입력해주세요"
          className={inputClassName}
        />

        <input
          type="text"
          value={requestNote}
          onChange={(e) => setRequestNote(e.target.value)}
          placeholder="배송 요청사항 (선택)"
          className={inputClassName}
        />

        <label className="flex items-center gap-2 text-[14px] text-[#111111]">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="size-[18px] accent-[#00AAFF]"
          />
          기본 배송지로 설정
        </label>
      </div>

      <div className="px-[16px] py-[24px]">
        <Button
          variant="filled"
          size="54"
          className="!w-full"
          disabled={!isValid || isSaving}
          onClick={handleSave}
        >
          저장
        </Button>
      </div>
    </div>
  );
};

export default AddressFormPage;
