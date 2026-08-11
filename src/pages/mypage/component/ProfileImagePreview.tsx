import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { DoubleButton } from '@/shared/components';

export interface ProfileImagePreviewProps {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (croppedImage: Blob) => void;
}

const CIRCLE_SIZE = 256;
const OUTPUT_SIZE = 512;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ProfileImagePreview = ({ imageUrl, onCancel, onConfirm }: ProfileImagePreviewProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);

  const [naturalSize, setNaturalSize] = useState({ width: CIRCLE_SIZE, height: CIRCLE_SIZE });
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const imgSize = {
    width: naturalSize.width * baseScale * zoom,
    height: naturalSize.height * baseScale * zoom,
  };

  const clampOffset = (x: number, y: number, size: { width: number; height: number }) => {
    const maxX = Math.max(0, (size.width - CIRCLE_SIZE) / 2);
    const maxY = Math.max(0, (size.height - CIRCLE_SIZE) / 2);
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  };

  const handleImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const { naturalWidth, naturalHeight } = img;
    const scale = Math.max(CIRCLE_SIZE / naturalWidth, CIRCLE_SIZE / naturalHeight);
    setNaturalSize({ width: naturalWidth, height: naturalHeight });
    setBaseScale(scale);
    setZoom(MIN_ZOOM);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2) {
      dragRef.current = null;
      const [p1, p2] = Array.from(pointersRef.current.values());
      pinchRef.current = { distance: Math.hypot(p1.x - p2.x, p1.y - p2.y), zoom };
    } else if (pointersRef.current.size === 1) {
      pinchRef.current = null;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: offset.x,
        originY: offset.y,
      };
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchRef.current) {
      const [p1, p2] = Array.from(pointersRef.current.values());
      const distance = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const nextZoom = clamp(
        pinchRef.current.zoom * (distance / pinchRef.current.distance),
        MIN_ZOOM,
        MAX_ZOOM,
      );
      const nextSize = {
        width: naturalSize.width * baseScale * nextZoom,
        height: naturalSize.height * baseScale * nextZoom,
      };
      setZoom(nextZoom);
      setOffset((prev) => clampOffset(prev.x, prev.y, nextSize));
      return;
    }

    if (dragRef.current) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setOffset(clampOffset(dragRef.current.originX + dx, dragRef.current.originY + dy, imgSize));
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    pinchRef.current = null;

    const remaining = Array.from(pointersRef.current.values())[0];
    dragRef.current = remaining
      ? { startX: remaining.x, startY: remaining.y, originX: offset.x, originY: offset.y }
      : null;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!img || !ctx) return;

    const scale = imgSize.width / img.naturalWidth;
    const sourceSize = CIRCLE_SIZE / scale;
    const sourceLeft = (imgSize.width / 2 - CIRCLE_SIZE / 2 - offset.x) / scale;
    const sourceTop = (imgSize.height / 2 - CIRCLE_SIZE / 2 - offset.y) / scale;

    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    ctx.drawImage(
      img,
      sourceLeft,
      sourceTop,
      sourceSize,
      sourceSize,
      0,
      0,
      OUTPUT_SIZE,
      OUTPUT_SIZE,
    );
    canvas.toBlob((blob) => blob && onConfirm(blob), 'image/jpeg', 0.92);
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[768px] min-w-[320px] flex-col items-center justify-center gap-10 bg-black px-6">
      <div
        className="relative size-64 touch-none overflow-hidden rounded-full"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="선택한 프로필 사진"
          draggable={false}
          onLoad={handleImgLoad}
          className="pointer-events-none absolute top-1/2 left-1/2 max-w-none select-none"
          style={{
            width: imgSize.width,
            height: imgSize.height,
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
          }}
        />
      </div>
      <div className="w-full">
        <DoubleButton
          layout="half"
          leftLabel="취소하기"
          rightLabel="완료하기"
          onLeftClick={onCancel}
          onRightClick={handleConfirm}
        />
      </div>
    </div>
  );
};

export default ProfileImagePreview;
