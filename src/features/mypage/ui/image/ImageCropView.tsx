import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { leftArrow } from '@/shared/assets';

export interface ImageCropViewProps {
  imageUrl: string;
  onCancel: () => void;
  onConfirm: (croppedDataUrl: string) => void;
}

const CROP_WIDTH = 288;
const CROP_HEIGHT = 384;
const OUTPUT_W = 384;
const OUTPUT_H = 512;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const ImageCropView = ({ imageUrl, onCancel, onConfirm }: ImageCropViewProps) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const [imgSize, setImgSize] = useState({ width: CROP_WIDTH, height: CROP_HEIGHT });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const clampOffset = (x: number, y: number, size: { width: number; height: number }) => {
    const maxX = Math.max(0, (size.width - CROP_WIDTH) / 2);
    const maxY = Math.max(0, (size.height - CROP_HEIGHT) / 2);
    return { x: clamp(x, -maxX, maxX), y: clamp(y, -maxY, maxY) };
  };

  const handleImgLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const { naturalWidth, naturalHeight } = img;
    const scale = Math.max(CROP_WIDTH / naturalWidth, CROP_HEIGHT / naturalHeight);
    const nextSize = { width: naturalWidth * scale, height: naturalHeight * scale };
    setImgSize(nextSize);
    setOffset({ x: 0, y: 0 });
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clampOffset(dragRef.current.originX + dx, dragRef.current.originY + dy, imgSize));
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleConfirm = () => {
    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!img || !ctx) {
      onConfirm(imageUrl);
      return;
    }

    const scale = imgSize.width / img.naturalWidth;
    const sourceW = CROP_WIDTH / scale;
    const sourceH = CROP_HEIGHT / scale;
    const sourceLeft = (imgSize.width / 2 - CROP_WIDTH / 2 - offset.x) / scale;
    const sourceTop = (imgSize.height / 2 - CROP_HEIGHT / 2 - offset.y) / scale;

    canvas.width = OUTPUT_W;
    canvas.height = OUTPUT_H;
    ctx.drawImage(img, sourceLeft, sourceTop, sourceW, sourceH, 0, 0, OUTPUT_W, OUTPUT_H);
    onConfirm(canvas.toDataURL('image/jpeg', 0.92));
  };

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col bg-black">
      {/* 상단 바 */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          aria-label="취소"
          className="flex size-9 items-center justify-center rounded-full bg-white/20"
        >
          <img src={leftArrow} alt="" className="size-5 brightness-0 invert" />
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="text-body-1 font-semibold text-[#007AFF]"
        >
          완료
        </button>
      </div>

      {/* 크롭 영역 */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className="relative touch-none overflow-hidden rounded-2xl"
          style={{ width: CROP_WIDTH, height: CROP_HEIGHT }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <img
            ref={imgRef}
            src={imageUrl}
            alt="선택한 사진"
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
      </div>
    </div>
  );
};

export default ImageCropView;
