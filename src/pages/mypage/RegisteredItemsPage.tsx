import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackHeader, Input } from '@/shared/components';
import { plus } from '@/shared/assets';
import { RegisteredItemListSection } from '@/features/mypage/ui';
import { registeredItems } from './mock';

const RegisteredItemsPage = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = registeredItems.filter(
    (item) =>
      item.brand.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md">
      <BackHeader
        title="등록한 아이템"
        rightActions={
          <button type="button" aria-label="아이템 추가">
            <img src={plus} className="size-5.5" alt="" />
          </button>
        }
      />
      <div className="px-4 py-3">
        <Input
          size={44}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="검색"
          className="!bg-gray-bg !border-transparent"
        />
      </div>
      <RegisteredItemListSection
        items={filtered}
        onItemClick={(id) => navigate(`/mypage/items/${id}`)}
        onSaleConvert={(id) => navigate(`/mypage/items/${id}/sell`)}
      />
    </div>
  );
};

export default RegisteredItemsPage;
