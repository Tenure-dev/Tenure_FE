import { useRef, type PointerEvent } from 'react';
import type { Bbox } from '@/features/ootd/model/item';
import TagMessage from './TagMessage';

type Props = {
  bbox: Bbox; // 0~1 정규화
  label: string;
  active: boolean; // 이 태그가 선택(활성)됐는지 → 박스 표시 여부
  onActivate: () => void; // 말풍선 클릭 시
  onChange: (bbox: Bbox) => void;
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

// 이미지 위 태그: 말풍선은 항상 표시, 누르면 활성화되어 박스(+스포트라이트)가 뜨고 드래그 가능 (A: 이동만)
const TagBBox = ({ bbox, label, active, onActivate, onChange }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const container = wrapperRef.current?.parentElement; // 이미지 컨테이너 기준으로 정규화
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const start = bbox;

    const handleMove = (ev: globalThis.PointerEvent) => {
      const dx = (ev.clientX - startX) / rect.width;
      const dy = (ev.clientY - startY) / rect.height;
      onChange({
        ...start,
        x: clamp(start.x + dx, 0, 1 - start.width),
        y: clamp(start.y + dy, 0, 1 - start.height),
      });
    };
    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

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
      {/* 활성 태그만: 박스 테두리 + 주변 어둡게(스포트라이트) + 드래그 */}
      {active && (
        <div
          onPointerDown={handlePointerDown}
          className="border-primary absolute inset-0 cursor-move touch-none rounded-lg border-3"
          style={{ boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.4)' }}
        />
      )}

      {/* 말풍선: 항상 표시, 누르면 이 태그 활성화(=bbox 표시) */}
      <button type="button" onClick={onActivate} className="absolute bottom-full left-0 z-10 mb-1">
        <TagMessage title={label} side="left" variant="black" />
      </button>
    </div>
  );
};

export default TagBBox;
