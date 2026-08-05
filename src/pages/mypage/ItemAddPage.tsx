import { useNavigate } from 'react-router-dom';
import { BackHeader } from '@/shared/components';
import { ItemAddForm } from '@/features/mypage/ui';

const ItemAddPage = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md">
      <BackHeader title="아이템 등록" />
      <ItemAddForm
        onSuccess={() => navigate('/mypage/items', { state: { toast: '아이템이 등록되었습니다' } })}
      />
    </div>
  );
};

export default ItemAddPage;
