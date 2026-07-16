import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import chevon from '@/shared/assets/chevon.svg';
import type { OotdItem } from '@/features/ootd/model/item';
import { existingItems } from '@/features/ootd/mock';
import TagLoading from './component/TagLoading';
import TagResultSheet from './component/TagResultSheet';
import NewItemSheet from './component/NewItemSheet';

type Phase = 'loading' | 'result';

const OotdTagPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photo = (location.state as { photo?: string } | null)?.photo ?? null;

  const [phase, setPhase] = useState<Phase>('loading');
  const [items, setItems] = useState<OotdItem[]>(existingItems);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [query, setQuery] = useState('');
  const [newItemOpen, setNewItemOpen] = useState(false);

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
    setExpanded(true);
  };

  // 선택 완료: 실제 게시글 작성은 다음 작업 (지금은 이전 화면으로 복귀)
  const handleComplete = () => navigate(-1);

  const title = phase === 'loading' ? '새 게시물 작성' : 'OOTD 등록';

  return (
    <div className="bg-bg-white relative flex h-dvh w-full flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex items-center gap-2 p-4">
        <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
          <img src={chevon} width={24} height={24} alt="" />
        </button>
        <h1 className="text-title-2 font-semibold">{title}</h1>
      </header>

      {/* 진행바 */}
      <div className="bg-bg-100 h-1 w-full">
        <div className={phase === 'loading' ? 'bg-brand h-full w-1/3' : 'bg-brand h-full w-2/3'} />
      </div>

      {phase === 'loading' ? (
        <TagLoading />
      ) : (
        <div className="relative flex-1 overflow-hidden bg-black">
          {/* 사진 */}
          {photo && <img src={photo} alt="촬영한 사진" className="size-full object-cover" />}

          {/* 감지 박스 (목업 위치) */}
          <div className="pointer-events-none absolute top-1/3 left-1/4 h-1/3 w-1/2 rounded-2xl border-2 border-white/80" />

          {/* 분석 결과 바텀시트 */}
          <TagResultSheet
            items={items}
            selectedIds={selectedIds}
            onToggle={toggleSelect}
            expanded={expanded}
            onToggleExpand={() => setExpanded((v) => !v)}
            searchMode={searchMode}
            query={query}
            onQueryChange={setQuery}
            onSearchOpen={() => {
              setSearchMode(true);
              setExpanded(true);
            }}
            onSearchClose={() => {
              setSearchMode(false);
              setQuery('');
            }}
            onNewItem={() => setNewItemOpen(true)}
            onComplete={handleComplete}
          />

          {/* 새 아이템 등록 시트 */}
          {newItemOpen && (
            <NewItemSheet onBack={() => setNewItemOpen(false)} onRegister={handleRegister} />
          )}
        </div>
      )}
    </div>
  );
};

export default OotdTagPage;
