import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import chevon from '@/shared/assets/chevron-left.svg';
import { cn } from '@/shared/lib/cn';
import type { Bbox } from '@/features/ootd/model/item';
import { useSimilarItems } from '@/features/ootd/api/useSimilarItems';
import OotdTagEditor, { type EditorTag } from '@/features/ootd/ui/OotdTagEditor';

// 미리보기('태그 수정')에서 돌아올 때 넘어오는 state
type NavState = {
  photo?: string;
  ootdId?: number;
  tags?: { itemId: number; bbox: Bbox; labelText: string }[];
} | null;

const OotdTagPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nav = location.state as NavState;
  const photo = nav?.photo ?? null;
  const ootdId = nav?.ootdId;

  // 헤더 제목/진행바 표시용 분석 로딩 상태. 에디터도 같은 훅을 쓰지만 react-query 캐시로 dedup됨.
  const { isPending } = useSimilarItems();

  // '태그 수정'으로 돌아온 경우 기존 태그 복원. 에디터에서 편집되면 onChange로 최신화.
  const initialTags: EditorTag[] = (nav?.tags ?? []).map((t) => ({
    itemId: t.itemId,
    bbox: t.bbox,
    labelText: t.labelText,
  }));
  const [tags, setTags] = useState<EditorTag[]>(initialTags);
  const tagCount = tags.length;

  // 결과 시트를 최대치까지 올리면 헤더/진행바를 위로 접어 숨긴다.
  const [sheetExpanded, setSheetExpanded] = useState(false);

  // 완료 → 태그와 함께 미리보기로 (preview는 photo·tags만 사용)
  const handleComplete = () => {
    const previewTags = tags.map((t) => ({
      itemId: t.itemId,
      bbox: t.bbox,
      labelText: t.labelText,
    }));
    navigate('/ootd/preview', { state: { photo, ootdId, tags: previewTags } });
  };

  const title = isPending ? '새 게시물 작성' : 'OOTD 등록';

  return (
    <div className="bg-bg-white relative flex h-dvh w-full flex-col overflow-hidden">
      {/* 헤더 + 진행바: 시트를 최대치로 올리면 위로 접혀 사라진다 */}
      <div
        className={cn(
          'shrink-0 overflow-hidden transition-all duration-300 ease-out',
          sheetExpanded
            ? 'max-h-0 -translate-y-full opacity-0'
            : 'max-h-24 translate-y-0 opacity-100',
        )}
      >
        {/* 헤더 */}
        <header className="flex items-center gap-2 p-4">
          <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
            <img src={chevon} width={24} height={24} alt="" />
          </button>
          <h1 className="text-title-2 font-semibold">{title}</h1>
          {!isPending && (
            <button
              type="button"
              onClick={handleComplete}
              disabled={tagCount === 0}
              className={`text-body-1 ml-auto font-semibold ${
                tagCount > 0 ? 'text-success' : 'text-text-disabled'
              }`}
            >
              완료({tagCount})
            </button>
          )}
        </header>

        {/* 진행바 */}
        <div className="bg-bg-tertiary h-1 w-full">
          <div className={isPending ? 'bg-brand h-full w-1/3' : 'bg-brand h-full w-2/3'} />
        </div>
      </div>

      <OotdTagEditor
        photo={photo}
        ootdId={ootdId}
        initialTags={initialTags}
        onChange={setTags}
        onSheetExpandedChange={setSheetExpanded}
        className="flex-1"
      />
    </div>
  );
};

export default OotdTagPage;
