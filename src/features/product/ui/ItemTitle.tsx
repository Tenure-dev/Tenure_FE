import { cn } from '@/shared/lib/cn';
import type { ProductSaleStatus } from '../model/types';

export interface ItemTitleProps {
  brand: string;
  name: string;
  saleStatus: ProductSaleStatus;
  price?: number;
}

const STATUS_TEXT: Partial<Record<ProductSaleStatus, { label: string; className: string }>> = {
  hidden: { label: '미판매', className: 'text-text-disabled' },
  sold: { label: '판매 완료', className: 'text-success' },
  trading: { label: '거래 중', className: 'text-success' },
};

const ItemTitle = ({ brand, name, saleStatus, price }: ItemTitleProps) => {
  const status = STATUS_TEXT[saleStatus];

  return (
    <div className="flex flex-col gap-1">
      <p className="text-title-2 text-text-inverse font-semibold">
        {brand} / {name}
      </p>
      {status ? (
        <p className={cn('text-title-3 font-medium', status.className)}>{status.label}</p>
      ) : (
        <p className={'text-title-3 text-error font-medium'}>{(price ?? 0).toLocaleString()}원</p>
      )}
    </div>
  );
};

export default ItemTitle;
