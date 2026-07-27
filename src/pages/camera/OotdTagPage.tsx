import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import chevon from '@/shared/assets/chevron-left.svg';
import type { OotdItem } from '@/features/ootd/model/item';
import { existingItems } from '@/features/ootd/mock';
import TagLoading from './component/TagLoading';
import TagResultSheet from './component/TagResultSheet';
import NewItemSheet from './component/NewItemSheet';
import TagMessage from './component/TagMessage';

type Phase = 'loading' | 'result';

// 선택된 아이템 말풍선 배치 위치 (사진 상단, 바텀시트 안 가리게)
const TAG_POS = ['left-4 top-4', 'right-4 top-4', 'left-4 top-28', 'right-4 top-28'];

const OotdTagPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photo = (location.state as { photo?: string } | null)?.photo ?? null;

  const [phase, setPhase] = useState<Phase>('loading');
  const [items, setItems] = useState<OotdItem[]>(existingItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [showBox, setShowBox] = useState(true);

  // 로딩 → 결과 (분석 준비 시뮬레이션)
  useEffect(() => {
    const timer = setTimeout(() => setPhase('result'), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRegister = (item: OotdItem) => {
    setItems((prev) => [item, ...prev]);
    setSelectedIds((prev) => new Set(prev).add(item.id));
    setNewItemOpen(false);
  };

  // 선택 완료 → 게시물 미리보기로 (사진 + 선택한 태그 아이템 전달)
  const handleComplete = () => {
    const selected = items.filter((item) => selectedIds.has(item.id));
    navigate('/ootd/preview', { state: { photo, items: selected } });
  };

  const title = phase === 'loading' ? '새 게시물 작성' : 'OOTD 등록';

  return (
    <div className="bg-bg-white relative flex h-dvh w-full flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center gap-2 p-4">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
          <img src={chevon} width={24} height={24} alt="" />
        </button>
        <h1 className="text-title-2 font-semibold">{title}</h1>
        {phase === 'result' && (
          <button
            type="button"
            onClick={handleComplete}
            disabled={selectedIds.size === 0}
            className={`text-body-1 ml-auto font-semibold ${
              selectedIds.size > 0 ? 'text-success' : 'text-text-disabled'
            }`}
          >
            완료({selectedIds.size})
          </button>
        )}
      </header>

      {/* 진행바 */}
      <div className="bg-bg-tertiary h-1 w-full">
        <div className={phase === 'loading' ? 'bg-brand h-full w-1/3' : 'bg-brand h-full w-2/3'} />
      </div>

      {phase === 'loading' ? (
        <TagLoading />
      ) : (
        <div className="bg-bg-white relative flex-1 overflow-hidden">
          {/* 사진: 원본 비율 그대로 헤더 아래 (여백 없음) */}
          <div className="relative w-full overflow-hidden">
            {photo && <img src={photo} alt="촬영한 사진" className="block w-full" />}

            {/* 감지 박스: 박스 안은 사진 그대로, 주변은 어둡게 (스포트라이트) — 토글로 on/off */}
            {showBox && (
              <div
                className="border-border-primary pointer-events-none absolute top-1/2 left-1/2 h-[185px] w-[275px] -translate-1/2 rounded-lg border-4"
                style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)' }}
              />
            )}

            {/* 감지 박스 보기/숨기기 토글 */}
            <button
              type="button"
              onClick={() => setShowBox((v) => !v)}
              aria-label={showBox ? '감지 박스 숨기기' : '감지 박스 보기'}
              className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/60"
            >
              {showBox ? (
                <Eye size={20} className="text-white" />
              ) : (
                <EyeOff size={20} className="text-white" />
              )}
            </button>

            {/* 선택된 아이템 말풍선 (블랙) — 항상 표시 */}
            {Array.from(selectedIds).map((id, i) => {
              const item = items.find((it) => it.id === id);
              if (!item) return null;
              const pos = TAG_POS[i % TAG_POS.length];
              return (
                <TagMessage
                  key={id}
                  variant="black"
                  className={`absolute ${pos}`}
                  title={`${item.brand} / ${item.name}`}
                  status="판매중"
                  side={pos.includes('left') ? 'left' : 'right'}
                />
              );
            })}
          </div>

          {/* 분석 결과 바텀시트 */}
          <TagResultSheet
            items={items}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            searchMode={searchMode}
            query={query}
            onQueryChange={setQuery}
            onSearchOpen={() => setSearchMode(true)}
            onSearchClose={() => {
              setSearchMode(false);
              setQuery('');
            }}
            onNewItem={() => setNewItemOpen(true)}
          />

          {/* 새 아이템 등록 시트 */}
          {newItemOpen && (
            <NewItemSheet onBack={() => setNewItemOpen(false)} onSubmit={handleRegister} />
          )}
        </div>
      )}
    </div>
  );
};

export default OotdTagPage;
