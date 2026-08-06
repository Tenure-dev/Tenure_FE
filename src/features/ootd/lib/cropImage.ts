import type { Bbox } from '../model/item';

// dataURL 이미지에서 bbox(0~1 정규화) 영역만 잘라 JPEG File로 반환.
// 새 아이템 등록 시 대표 이미지(bbox 부분)로 업로드하는 데 사용.
export const cropImageToBbox = (
  dataUrl: string,
  bbox: Bbox,
  fileName = 'tag-item.jpg',
): Promise<File> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const sx = Math.round(bbox.x * img.width);
      const sy = Math.round(bbox.y * img.height);
      const sw = Math.max(1, Math.round(bbox.width * img.width));
      const sh = Math.max(1, Math.round(bbox.height * img.height));

      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('canvas context를 만들 수 없어요.'));

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('이미지 크롭에 실패했어요.'));
          resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        0.9,
      );
    };
    img.onerror = () => reject(new Error('이미지를 불러오지 못했어요.'));
    img.src = dataUrl;
  });
