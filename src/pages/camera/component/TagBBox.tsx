import { useRef, type PointerEvent } from 'react';
import type { Bbox } from '@/features/ootd/model/item';
import TagBubble, { type TagBubbleTail, type TagBubbleVariant } from '@/features/ootd/ui/TagBubble';

type Props = {
  bbox: Bbox; // 0~1 정규화
  label: string;
  active: boolean; // 이 태그가 선택(활성)됐는지 → 시트에 반영
  showFrame: boolean; // 박스 테두리+스포트라이트+리사이즈 핸들 표시 여부(새 박스 배치 중일 때만 true).
  // 기존 태그를 말풍선 클릭으로 활성화했을 때는 false로 넘어와 말풍선만 선택 표시된다.
  onActivate: () => void; // 말풍선 클릭 시
  onChange: (bbox: Bbox) => void;
  onSettle?: () => void; // 이동/리사이즈 끝(pointerup) 시 — 분석 API 트리거용
  variant?: TagBubbleVariant; // 말풍선 색(기본 black). 손 안 댄 기존 태그는 default(흰색)
};

type Corner = 'nw' | 'ne' | 'sw' | 'se';

const MIN_W = 0.08; // 박스 최소 가로(이미지 가로 대비 비율) — 안경/스카프 같은 작은 액세서리도 감쌀 수 있게
const MIN_H = 0.06; // 박스 최소 세로(이미지 세로 대비 비율)
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// 이미지 위 태그: 말풍선은 항상 표시, 누르면 활성화되어 박스(+스포트라이트)가 뜨고
// 가운데를 잡으면 이동, 모서리 핸들을 잡으면 크기 조절.
const TagBBox = ({
  bbox,
  label,
  active,
  showFrame,
  onActivate,
  onChange,
  onSettle,
  variant = 'black',
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 공통 드래그: pointerdown 시점 bbox 기준으로 dx,dy(정규화)를 compute에 넘겨 새 bbox 생성
  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    compute: (dx: number, dy: number, start: Bbox) => Bbox,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId); // 모바일 드래그 끊김 방지
    const container = wrapperRef.current?.parentElement; // 이미지 컨테이너 기준 정규화
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const start = bbox;

    const move = (ev: globalThis.PointerEvent) => {
      const dx = (ev.clientX - startX) / rect.width;
      const dy = (ev.clientY - startY) / rect.height;
      onChange(compute(dx, dy, start));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      onSettle?.(); // 이동/리사이즈 끝 → 분석 트리거
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  // 이동: x,y만 변경 (박스가 이미지 밖으로 안 나가게 clamp)
  const onMoveDown = (e: PointerEvent<HTMLDivElement>) =>
    startDrag(e, (dx, dy, s) => ({
      ...s,
      x: clamp(s.x + dx, 0, 1 - s.width),
      y: clamp(s.y + dy, 0, 1 - s.height),
    }));

  // 리사이즈: 잡은 모서리(data-corner)의 반대편을 고정하고 크기 조절
  const onResizeDown = (e: PointerEvent<HTMLDivElement>) => {
    const corner = (e.currentTarget.dataset.corner ?? 'se') as Corner;
    startDrag(e, (dx, dy, s) => {
      const right = s.x + s.width;
      const bottom = s.y + s.height;
      if (corner === 'se') {
        return {
          ...s,
          width: clamp(s.width + dx, MIN_W, 1 - s.x),
          height: clamp(s.height + dy, MIN_H, 1 - s.y),
        };
      }
      if (corner === 'sw') {
        const x = clamp(s.x + dx, 0, right - MIN_W);
        return { ...s, x, width: right - x, height: clamp(s.height + dy, MIN_H, 1 - s.y) };
      }
      if (corner === 'ne') {
        const y = clamp(s.y + dy, 0, bottom - MIN_H);
        return { ...s, y, width: clamp(s.width + dx, MIN_W, 1 - s.x), height: bottom - y };
      }
      // nw
      const x = clamp(s.x + dx, 0, right - MIN_W);
      const y = clamp(s.y + dy, 0, bottom - MIN_H);
      return { ...s, x, y, width: right - x, height: bottom - y };
    });
  };

  // 보이는 장식 없이 모서리에 투명한 탭 영역만 (박스 테두리만 깔끔하게 보임)
  const handleClass = 'absolute z-20 size-6 touch-none';

  // 말풍선을 게시글(TagPin)과 동일하게 배치한다: 태그 지점(박스 중심)에 꼬리 모서리를 붙이고
  // 가장자리에 가까우면 반대쪽으로 펼친다. (편집·미리보기·게시글 태그 위치를 일치시키기 위함)
  const cxPct = (bbox.x + bbox.width / 2) * 100;
  const cyPct = (bbox.y + bbox.height / 2) * 100;
  const flipX = cxPct > 65;
  const flipY = cyPct < 25;
  const tail: TagBubbleTail = !flipY ? (flipX ? 'br' : 'bl') : flipX ? 'tr' : 'tl';

  return (
    <div
      ref={wrapperRef}
      className="absolute"
      style={{
        left: `${bbox.x * 100}%`,
        top: `${bbox.y * 100}%`,
        width: `${bbox.width * 100}%`,
        height: `${bbox.height * 100}%`,
      }}
    >
      {/* 새 박스를 배치/조정하는 중일 때만: 박스 테두리 + 주변 어둡게(스포트라이트) + 이동/리사이즈.
          기존 태그를 말풍선으로 활성화했을 때는(showFrame=false) 안 뜬다 — 아래 말풍선만 선택 표시. */}
      {active && showFrame && (
        <>
          {/* 가운데: 이동 */}
          <div
            onPointerDown={onMoveDown}
            className="border-primary absolute inset-0 cursor-move touch-none rounded-lg border-3"
            style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)' }}
          />
          {/* 네 모서리: 리사이즈 */}
          <div
            data-corner="nw"
            onPointerDown={onResizeDown}
            className={`${handleClass} -top-3 -left-3 cursor-nwse-resize`}
          />
          <div
            data-corner="ne"
            onPointerDown={onResizeDown}
            className={`${handleClass} -top-3 -right-3 cursor-nesw-resize`}
          />
          <div
            data-corner="sw"
            onPointerDown={onResizeDown}
            className={`${handleClass} -bottom-3 -left-3 cursor-nesw-resize`}
          />
          <div
            data-corner="se"
            onPointerDown={onResizeDown}
            className={`${handleClass} -right-3 -bottom-3 cursor-nwse-resize`}
          />
        </>
      )}

      {/* 말풍선(태그): 라벨이 있고 박스 테두리가 안 뜬 상태(비활성, 또는 기존 태그를 방금 선택한 상태)일 때만.
          누르면 활성화/비활성 토글. 박스 중심(top/left-1/2)을 태그 지점 삼아 TagPin과 동일한 transform으로 펼친다. */}
      {(!active || !showFrame) && label && (
        <button
          type="button"
          onClick={onActivate}
          className="absolute top-1/2 left-1/2 z-10"
          style={{ transform: `translate(${flipX ? '-100%' : '0%'}, ${flipY ? '0%' : '-100%'})` }}
        >
          <TagBubble title={label} tail={tail} variant={variant} selected={active} />
        </button>
      )}
    </div>
  );
};

export default TagBBox;
