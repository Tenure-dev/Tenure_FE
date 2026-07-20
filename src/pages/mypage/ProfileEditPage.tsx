import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackHeader, DoubleButton, Input } from '@/shared/components';
import { useProfileStore, type Gender } from '@/store/useProfileStore';
import ProfileImagePreview from './component/ProfileImagePreview';
import GenderToggle from './component/GenderToggle';
import ProfilePhotoPicker from './component/ProfilePhotoPicker';
import ProfileSlider from './component/ProfileSlider';

const HEIGHT_RANGE = { min: 140, max: 200 };
const WEIGHT_RANGE = { min: 30, max: 150 };

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const storedProfile = useProfileStore();

  const [nickname, setNickname] = useState(storedProfile.name);
  const [gender, setGender] = useState<Gender>(storedProfile.gender);
  const [height, setHeight] = useState(storedProfile.height);
  const [weight, setWeight] = useState(storedProfile.weight);
  const [photoUrl, setPhotoUrl] = useState<string | null>(storedProfile.photoUrl);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  const handleFileSelected = (file: File) => {
    setPendingPhoto(URL.createObjectURL(file));
  };

  const handleConfirmPhoto = (croppedImageUrl: string) => {
    setPhotoUrl(croppedImageUrl);
    if (pendingPhoto) URL.revokeObjectURL(pendingPhoto);
    setPendingPhoto(null);
  };

  const handleCancelPhoto = () => {
    if (pendingPhoto) URL.revokeObjectURL(pendingPhoto);
    setPendingPhoto(null);
  };

  const handleSave = () => {
    // TODO: 프로필 수정 API 연동
    storedProfile.setProfile({ name: nickname, gender, height, weight, photoUrl });
    navigate('/mypage', { state: { toast: '프로필이 저장되었습니다' } });
  };

  return (
    <div className="bg-bg-white text-text-primary mx-auto min-h-screen max-w-md pb-8">
      <BackHeader title="프로필 수정" />

      <ProfilePhotoPicker imageUrl={photoUrl} onFileSelected={handleFileSelected} />

      <div className="flex flex-col gap-6 px-4">
        <div className="flex flex-col gap-2">
          <p className="text-body-2 text-text-secondary">닉네임</p>
          <Input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            showPasswordToggle={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-body-2 text-text-secondary">성별</p>
          <GenderToggle value={gender} onChange={setGender} />
        </div>

        <ProfileSlider
          label="키"
          min={HEIGHT_RANGE.min}
          max={HEIGHT_RANGE.max}
          unit="cm"
          value={height}
          onChange={setHeight}
        />
        <ProfileSlider
          label="몸무게"
          min={WEIGHT_RANGE.min}
          max={WEIGHT_RANGE.max}
          unit="kg"
          value={weight}
          onChange={setWeight}
        />
      </div>

      <div className="mt-8 px-4">
        <DoubleButton
          layout="half"
          leftLabel="돌아가기"
          rightLabel="저장하기"
          onLeftClick={() => navigate(-1)}
          onRightClick={handleSave}
        />
      </div>

      {pendingPhoto && (
        <ProfileImagePreview
          imageUrl={pendingPhoto}
          onCancel={handleCancelPhoto}
          onConfirm={handleConfirmPhoto}
        />
      )}
    </div>
  );
};

export default ProfileEditPage;
