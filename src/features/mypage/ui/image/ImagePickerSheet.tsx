import { useRef, type ChangeEvent } from 'react';
import { BottomSheet } from '@/shared/components';

export interface ImagePickerSheetProps {
  open: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
  onPickFromPost: () => void;
  onError?: (message: string) => void;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 10 * 1024 * 1024;

const validateImageFile = (file: File): string | null => {
  const type = file.type.toLowerCase();
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';

  if (type === 'image/heic' || type === 'image/heif' || ext === 'heic' || ext === 'heif') {
    return '지원하지 않는 형식입니다. JPG, PNG, WebP를 사용해 주세요.';
  }

  if (type && !ALLOWED_TYPES.includes(type)) {
    return '지원하지 않는 형식입니다. JPG, PNG, WebP를 사용해 주세요.';
  }

  if (!type && !['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return '지원하지 않는 형식입니다. JPG, PNG, WebP를 사용해 주세요.';
  }

  if (file.size > MAX_BYTES) {
    return '10MB 이하의 파일만 업로드할 수 있습니다.';
  }

  return null;
};

const ImagePickerSheet = ({
  open,
  onClose,
  onFileSelected,
  onPickFromPost,
  onError,
}: ImagePickerSheetProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAlbumClick = () => {
    onClose();
    setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handlePostClick = () => {
    onClose();
    onPickFromPost();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      onError?.(error);
      return;
    }

    onFileSelected(file);
  };

  return (
    <>
      <BottomSheet open={open} onClose={onClose} variant="menu" className="max-w-md">
        <button
          type="button"
          onClick={handleAlbumClick}
          className="text-body-1 font-regular text-text-primary w-full py-4 text-center"
        >
          앨범에서 선택
        </button>
        <button
          type="button"
          onClick={handlePostClick}
          className="text-body-1 font-regular text-text-primary w-full py-4 text-center"
        >
          게시물에서 잘라오기
        </button>
      </BottomSheet>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImagePickerSheet;
