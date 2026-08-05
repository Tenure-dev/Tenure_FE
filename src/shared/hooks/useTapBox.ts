import { useState, type PointerEvent as ReactPointerEvent } from 'react';

export type PercentRect = { x: number; y: number; width: number; height: number }; // 0~100, top-left + size
export type NormalizedBbox = { x: number; y: number; width: number; height: number }; // 0~1

export type UseTapBoxOptions = {
  widthPercent: number;
  heightPercent: number;
  // 탭한 자리에 고정 크기 박스를 놓는 즉시 호출된다.
  onPlace: (bbox: NormalizedBbox) => void;
};

const clampRect = (x: number, y: number, width: number, height: number): PercentRect => ({
  x: Math.max(0, Math.min(100 - width, x)),
  y: Math.max(0, Math.min(100 - height, y)),
  width,
  height,
});

// 컨테이너를 탭하면 그 지점을 중심으로 고정 크기 사각형이 바로 뜨는 인터랙션(드래그로 크기 조절 없음).
export const useTapBox = ({ widthPercent, heightPercent, onPlace }: UseTapBoxOptions) => {
  const [rect, setRect] = useState<PercentRect | null>(null);

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    e.preventDefault();
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - bounds.left) / bounds.width) * 100));
    const y = Math.min(100, Math.max(0, ((e.clientY - bounds.top) / bounds.height) * 100));
    const halfW = widthPercent / 2;
    const halfH = heightPercent / 2;
    const next = clampRect(x - halfW, y - halfH, widthPercent, heightPercent);
    setRect(next);
    onPlace({
      x: next.x / 100,
      y: next.y / 100,
      width: next.width / 100,
      height: next.height / 100,
    });
  };

  const clear = () => setRect(null);

  return { rect, clear, handlers: { onPointerDown } };
};
