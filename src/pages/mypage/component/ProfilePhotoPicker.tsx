import { useState } from 'react';
import { Camera, CameraErrorCode } from '@capacitor/camera';
import editIcon from '@/shared/assets/edit.svg';
import imageIcon from '@/shared/assets/image.svg';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { BottomSheet, MenuRow } from '@/shared/components';

export interface ProfilePhotoPickerProps {
  imageUrl: string | null;
  onImageSelected: (webPath: string) => void;
  onResetToDefault: () => void;
}

const ProfilePhotoPicker = ({
  imageUrl,
  onImageSelected,
  onResetToDefault,
}: ProfilePhotoPickerProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handlePickFromAlbum = async () => {
    setSheetOpen(false);
    try {
      const { results } = await Camera.chooseFromGallery({});
      const webPath = results[0]?.webPath;
      if (webPath) onImageSelected(webPath);
    } catch (error) {
      // 사용자가 선택을 취소한 경우는 무시한다.
      if ((error as { code?: string })?.code !== CameraErrorCode.ChooseMediaCancelled) {
        console.error(error);
      }
    }
  };

  const handleUseDefault = () => {
    setSheetOpen(false);
    onResetToDefault();
  };

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <button type="button" onClick={() => setSheetOpen(true)} className="relative">
        <img
          src={imageUrl ?? profileDefault}
          alt="프로필 사진"
          className="bg-bg-200 size-32 rounded-full object-cover"
        />
        <span className="bg-bg-white absolute -right-0 -bottom-0 flex size-8 items-center justify-center rounded-full shadow-md">
          <img src={editIcon} width={16} height={16} alt="" />
        </span>
      </button>
      <p className="text-body-2 text-text-secondary">프로필 사진</p>

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
        <MenuRow
          icon={<img src={profileDefault} width={18} height={18} alt="" className="rounded-full" />}
          label="기본 이미지로 변경"
          onClick={handleUseDefault}
        />
      </BottomSheet>
    </div>
  );
};

export default ProfilePhotoPicker;
