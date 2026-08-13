import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import { useNavigate, useParams } from 'react-router-dom';
import { circleCheck } from '@/shared/assets';
import { BackHeader, CTAButton } from '@/shared/components';
import { useUserStore } from '@/store/userStore';
import { getSizeSystem } from '@/shared/lib/itemSizeData';
import type { ItemDetailResponse } from '@/features/mypage/model/items';
import { useItemDetailQuery } from '@/features/mypage/model/useItemDetailQuery';
import { useCreateProduct } from '@/features/mypage/model/useCreateProduct';
import { useItemOotdCandidatesQuery } from '@/features/mypage/model/useItemOotdCandidatesQuery';
import { SaleFormBody, OotdPickerView } from '@/features/product/ui/saleForm';
import type {
  SaleForm,
  SectionKey,
  WearingTarget,
  FeePolicy,
} from '@/features/product/ui/saleForm';
import { DEFAULT_CONDITION_FLAGS } from '@/features/product/ui/saleForm';

type View = 'form' | 'ootd-picker' | 'loading' | 'complete';

const SaleConversionPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const { data: item, isLoading } = useItemDetailQuery(Number(itemId));

  if (isLoading || !item) {
    return (
      <div className="bg-bg-white flex min-h-screen flex-col">
        <BackHeader title="판매 전환" />
        <div className="flex flex-1 items-center justify-center">
          <span className="text-body-3 text-text-secondary">로딩 중...</span>
        </div>
      </div>
    );
  }

  return <SaleConversionContent item={item} />;
};

const SaleConversionContent = ({ item }: { item: ItemDetailResponse }) => {
  const navigate = useNavigate();
  const grade = useUserStore((s) => s.user?.grade);
  const isBasic = grade === 'BASIC';
  const [view, setView] = useState<View>('form');
  const [tempOotdIds, setTempOotdIds] = useState<number[]>([]);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set<SectionKey>(['category', 'subCategory', 'size']),
  );

  const { mutate } = useCreateProduct(item.itemId);
  const { data: ootdData } = useItemOotdCandidatesQuery(item.itemId);

  const [form, setForm] = useState<SaleForm>(() => ({
    mainImageUrl: item.representativeImageUrl ?? '',
    brandName: item.brandName ?? '',
    itemName: item.itemName ?? '',
    categoryLarge: item.categoryLarge ?? '',
    categorySmall: item.categorySmall ?? '',
    sizeSystem: getSizeSystem(item.categoryLarge ?? '', item.sizeValue ?? ''),
    sizeValue: item.sizeValue ?? '',
    wearingTarget: item.wearingTarget ?? 'UNISEX',
    feePolicy: isBasic ? 'SELLER_PAYS' : '',
    shippingFee: isBasic ? '0' : '',
    price: '',
    attachedOotdIds: [],
    measurements: {},
    conditionFlags: DEFAULT_CONDITION_FLAGS,
    sellerDescription: '',
  }));

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handleSubmit = () => {
    const measurements = Object.fromEntries(
      Object.entries(form.measurements)
        .filter(([, v]) => v !== '' && v !== undefined)
        .map(([k, v]) => [k, Number(v)]),
    );

    setView('loading');
    mutate(
      {
        brandName: form.brandName,
        itemName: form.itemName,
        categoryLarge: form.categoryLarge,
        categorySmall: form.categorySmall,
        wearingTarget: (form.wearingTarget || 'UNISEX') as WearingTarget,
        sizeSystem: form.sizeSystem,
        sizeValue: form.sizeValue,
        price: Number(form.price),
        shippingFee: Number(form.shippingFee),
        feePolicy: form.feePolicy as FeePolicy,
        mainImageUrl: form.mainImageUrl,
        measurements: Object.keys(measurements).length > 0 ? measurements : undefined,
        conditionFlags: form.conditionFlags,
        sellerDescription: form.sellerDescription || undefined,
        attachedOotdIds: form.attachedOotdIds,
      },
      {
        onSuccess: () => setView('complete'),
        onError: () => setView('form'),
      },
    );
  };

  const openOotdPicker = () => {
    setTempOotdIds(form.attachedOotdIds);
    setView('ootd-picker');
  };

  const toggleTempOotd = (id: number) =>
    setTempOotdIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });

  const confirmOotdSelection = () => {
    setForm((prev) => ({ ...prev, attachedOotdIds: tempOotdIds }));
    setView('form');
  };

  const ootdCandidates = (ootdData?.content ?? []).map(({ ootdId, imageUrl }) => ({
    id: ootdId,
    imageUrl,
  }));

  const selectedOotds = ootdCandidates.filter(({ id }) => form.attachedOotdIds.includes(id));

  if (view === 'loading') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <BackHeader title="판매 전환" onBack={() => setView('form')} />
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <div className="border-gray-bg border-t-brand size-12 animate-spin rounded-full border-4" />
          <p className="text-title-2 text-text-primary font-semibold">게시하는 중...</p>
        </div>
      </div>
    );
  }

  if (view === 'complete') {
    return (
      <div className="bg-bg-white fixed inset-0 z-10 flex flex-col">
        <header className="border-border-light bg-bg-white flex h-[52px] items-center justify-center border-b px-4">
          <h1 className="text-title-4 text-text-primary font-medium">판매 게시 완료 / 전환 안내</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-5">
          <img src={circleCheck} alt="complete" className="size-[52px]" />
          <p className="text-title-3 text-text-primary font-semibold">판매 게시가 완료됐습니다.</p>
        </div>
        <div className="p-4">
          <CTAButton label="홈으로" onClick={() => navigate('/')} fullWidth />
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          'bg-bg-white mx-auto min-h-screen max-w-md',
          view === 'ootd-picker' && 'invisible',
        )}
      >
        <BackHeader title="판매 전환" />
        <SaleFormBody
          form={form}
          openSections={openSections}
          onToggleSection={toggleSection}
          onFormChange={(updates) => setForm((prev) => ({ ...prev, ...updates }))}
          onOpenOotdPicker={openOotdPicker}
          onRemoveOotd={(id) =>
            setForm((prev) => ({
              ...prev,
              attachedOotdIds: prev.attachedOotdIds.filter((i) => i !== id),
            }))
          }
          selectedOotds={selectedOotds}
          submitLabel="판매하기"
          onSubmit={handleSubmit}
          isBasic={isBasic}
        />
      </div>
      {view === 'ootd-picker' && (
        <OotdPickerView
          items={ootdCandidates}
          selectedIds={tempOotdIds}
          onToggle={toggleTempOotd}
          onConfirm={confirmOotdSelection}
          onBack={() => setView('form')}
        />
      )}
    </>
  );
};

export default SaleConversionPage;
