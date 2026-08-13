import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackHeader, Toast } from '@/shared/components';
import { useToast } from '@/shared/hooks/useToast';
import type { ProductDetailResponse } from '@/features/product/api/dto';
import type { FeePolicy, WearingTarget } from '@/features/product/api/dto';
import { useProductDetail } from '@/features/product/model/useProductDetail';
import { useUpdateProduct } from '@/features/product/model/useUpdateProduct';
import { resolveImageUrl } from '@/shared/lib/resolveImageUrl';
import { buildMeasurementsPayload } from '@/features/product/lib/measurementUtils';
import { SaleFormBody, OotdPickerView } from '@/features/product/ui/saleForm';
import type { SaleForm, SectionKey, FormMeasurements } from '@/features/product/ui/saleForm';
import { DEFAULT_CONDITION_FLAGS } from '@/features/product/ui/saleForm';

type View = 'form' | 'ootd-picker';

const ProductEditPage = () => {
  const { productId: productIdStr = '' } = useParams();
  const productId = Number(productIdStr);
  const { data, isLoading, isError } = useProductDetail(productId);

  if (isLoading) {
    return (
      <div className="bg-bg-white flex min-h-screen items-center justify-center">
        <span className="text-body-3 text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-bg-white flex min-h-screen items-center justify-center">
        <span className="text-body-3 text-text-secondary">상품 정보를 불러올 수 없습니다.</span>
      </div>
    );
  }

  return <ProductEditContent productId={productId} data={data} />;
};

const ProductEditContent = ({
  productId,
  data,
}: {
  productId: number;
  data: ProductDetailResponse;
}) => {
  const navigate = useNavigate();
  const { message: toastMessage, show: showToast, hide: hideToast } = useToast();
  const [view, setView] = useState<View>('form');
  const [tempOotdIds, setTempOotdIds] = useState<number[]>([]);
  const [openSections, setOpenSections] = useState<Set<SectionKey>>(
    new Set<SectionKey>(['category', 'subCategory', 'size']),
  );

  const [form, setForm] = useState<SaleForm>(() => ({
    mainImageUrl: data.mainImageUrl,
    brandName: data.item.brandName,
    itemName: data.item.itemName,
    categoryLarge: data.item.categoryLarge,
    categorySmall: data.item.categorySmall,
    sizeSystem: data.item.sizeSystem,
    sizeValue: data.item.sizeValue,
    wearingTarget: 'UNISEX',
    feePolicy: data.feePolicy,
    shippingFee: String(data.shippingFee),
    price: data.price != null ? String(data.price) : '',
    attachedOotdIds: data.representativeOotds.map((o) => o.ootdId),
    measurements: data.measurements
      ? (Object.fromEntries(
          Object.entries(data.measurements)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ) as FormMeasurements)
      : {},
    conditionFlags: data.conditionFlags
      ? {
          stain: data.conditionFlags.stain ?? false,
          tear: data.conditionFlags.tear ?? false,
          pillingOrDiscoloration: data.conditionFlags.pillingOrDiscoloration ?? false,
          repairHistory: data.conditionFlags.repairHistory ?? false,
          missingComponents: data.conditionFlags.missingComponents ?? false,
        }
      : DEFAULT_CONDITION_FLAGS,
    sellerDescription: data.sellerDescription ?? '',
  }));

  const { mutate, isPending } = useUpdateProduct(productId);

  const ootdItems = data.representativeOotds.map((o) => ({
    id: o.ootdId,
    imageUrl: resolveImageUrl(o.imageUrl),
  }));
  const selectedOotds = ootdItems.filter((o) => form.attachedOotdIds.includes(o.id));

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

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

  const handleSubmit = () => {
    const measurements = buildMeasurementsPayload(form.categoryLarge, form.measurements);

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
        representativeImageUrl: form.mainImageUrl,
        measurements,
        conditionFlags: form.conditionFlags,
        sellerDescription: form.sellerDescription || undefined,
        attachedOotdIds: form.attachedOotdIds,
      },
      {
        onSuccess: () => {
          navigate(`/product/${productId}`, {
            replace: true,
            state: { toast: '변경되었습니다.' },
          });
        },
        onError: () => {
          showToast('변경 실패했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  if (view === 'ootd-picker') {
    return (
      <OotdPickerView
        items={ootdItems}
        selectedIds={tempOotdIds}
        onToggle={toggleTempOotd}
        onConfirm={confirmOotdSelection}
        onBack={() => setView('form')}
      />
    );
  }

  return (
    <div className="bg-bg-white mx-auto min-h-screen max-w-md">
      <BackHeader title="수정하기" />
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
        submitLabel={isPending ? '수정 중...' : '수정하기'}
        onSubmit={handleSubmit}
      />
      <Toast message={toastMessage} onClose={hideToast} />
    </div>
  );
};

export default ProductEditPage;
