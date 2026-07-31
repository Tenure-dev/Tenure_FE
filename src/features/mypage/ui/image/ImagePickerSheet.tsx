import { useRef, type ChangeEvent } from 'react';
import { BottomSheet } from '@/shared/components';

export interface ImagePickerSheetProps {
  open: boolean;
  onClose: () => void;
  onFileSelected: (file: File) => void;
  onPickFromPost: () => void;
}

const ImagePickerSheet = ({
  open,
  onClose,
  onFileSelected,
  onPickFromPost,
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
    if (file) onFileSelected(file);
    e.target.value = '';
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
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default ImagePickerSheet;
