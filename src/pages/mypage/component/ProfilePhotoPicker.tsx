import { useRef, useState, type ChangeEvent } from 'react';
import editIcon from '@/shared/assets/edit.svg';
import imageIcon from '@/shared/assets/image.svg';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { BottomSheet, MenuRow } from '@/shared/components';

export interface ProfilePhotoPickerProps {
  imageUrl: string | null;
  onFileSelected: (file: File) => void;
}

const ProfilePhotoPicker = ({ imageUrl, onFileSelected }: ProfilePhotoPickerProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickFromAlbum = () => {
    setSheetOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <button type="button" onClick={() => setSheetOpen(true)} className="relative">
        <img
          src={imageUrl ?? profileDefault}
          alt="프로필 사진"
          className="bg-bg-200 size-24 rounded-full object-cover"
        />
        <span className="bg-bg-white absolute -right-0 -bottom-0 flex size-7 items-center justify-center rounded-full shadow-md">
          <img src={editIcon} width={14} height={14} alt="" />
        </span>
      </button>
      <p className="text-body-2 text-text-secondary">프로필 사진</p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        variant="menu"
        className="max-w-md"
      >
        <MenuRow
          icon={<img src={imageIcon} width={18} height={18} alt="" />}
          label="앨범에서 선택하기"
          onClick={handlePickFromAlbum}
        />
      </BottomSheet>
    </div>
  );
};

export default ProfilePhotoPicker;
