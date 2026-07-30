import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BackHeader, DoubleButton, Input, Toast } from '@/shared/components';
import { useProfileStore } from '@/store/useProfileStore';
import { useUserStore } from '@/store/userStore';
import { useToast } from '@/shared/hooks/useToast';
import { updateMyInfo, uploadProfileImage } from '@/features/auth/api/userApi';
import { useMyInfo } from '@/features/auth/model/useMyInfo';
import type { UserProfile } from '@/features/auth/api/types';
import { fromApiGender, toApiGender } from '@/features/auth/lib/gender';
import { resolveFileUrl } from '@/shared/lib/resolveFileUrl';
import { myPageQueryKey } from '@/features/mypage/api/useMyPage';
import ProfileImagePreview from './component/ProfileImagePreview';
import GenderToggle from './component/GenderToggle';
import ProfilePhotoPicker from './component/ProfilePhotoPicker';
import ProfileSlider from './component/ProfileSlider';

const HEIGHT_RANGE = { min: 140, max: 200 };
const WEIGHT_RANGE = { min: 30, max: 150 };

const ProfileEditPage = () => {
  const { data: myInfo, isLoading } = useMyInfo();

  if (isLoading || !myInfo) {
    return (
      <div className="bg-bg-white text-text-primary min-h-screen pb-8">
        <BackHeader title="프로필 수정" />
      </div>
    );
  }

  return <ProfileEditForm myInfo={myInfo} />;
};

// myInfo가 로드된 뒤에만 마운트되므로, 폼 상태를 mock 기본값이 아닌 실제 값으로 바로 초기화할 수 있다.
const ProfileEditForm = ({ myInfo }: { myInfo: UserProfile }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const storedProfile = useProfileStore();
  const setUser = useUserStore((state) => state.setUser);
  const { message: errorToast, show: showErrorToast, hide: hideErrorToast } = useToast();

  const [nickname, setNickname] = useState(myInfo.username);
  const [gender, setGender] = useState(fromApiGender(myInfo.gender));
  const [height, setHeight] = useState(myInfo.heightCm);
  const [weight, setWeight] = useState(myInfo.weightKg);
  const [photoUrl, setPhotoUrl] = useState(
    myInfo.profileImageUrl ? resolveFileUrl(myInfo.profileImageUrl) : null,
  );
  const [profileImageUrl, setProfileImageUrl] = useState(myInfo.profileImageUrl);
  const [pendingPhoto, setPendingPhoto] = useState<string | null>(null);

  const updateProfileMutation = useMutation({ mutationFn: updateMyInfo });
  const uploadPhotoMutation = useMutation({ mutationFn: uploadProfileImage });

  const handleFileSelected = (file: File) => {
    setPendingPhoto(URL.createObjectURL(file));
  };

  const handleConfirmPhoto = (croppedImage: Blob) => {
    setPhotoUrl(URL.createObjectURL(croppedImage));
    if (pendingPhoto) URL.revokeObjectURL(pendingPhoto);
    setPendingPhoto(null);

    const file = new File([croppedImage], 'profile.jpg', { type: 'image/jpeg' });
    uploadPhotoMutation.mutate(file, {
      onSuccess: (data) => setProfileImageUrl(data.imageUrl),
      onError: (error) => {
        console.error(error);
        showErrorToast('이미지 업로드에 실패했습니다');
      },
    });
  };

  const handleCancelPhoto = () => {
    if (pendingPhoto) URL.revokeObjectURL(pendingPhoto);
    setPendingPhoto(null);
  };

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        username: nickname,
        gender: toApiGender(gender),
        heightCm: height,
        weightKg: weight,
        profileImageUrl,
      },
      {
        onSuccess: (data) => {
          storedProfile.setProfile({
            name: data.username,
            gender: fromApiGender(data.gender),
            height: data.heightCm,
            weight: data.weightKg,
            photoUrl,
          });
          setUser(data);
          queryClient.invalidateQueries({ queryKey: myPageQueryKey });
          navigate('/mypage', { state: { toast: '프로필이 수정되었습니다' } });
        },
        onError: (error) => {
          console.error(error);
          showErrorToast('프로필 수정에 실패했습니다');
        },
      },
    );
  };

  return (
    <div className="bg-bg-white text-text-primary min-h-screen pb-8">
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
          disabled={uploadPhotoMutation.isPending || updateProfileMutation.isPending}
        />
      </div>

      {pendingPhoto && (
        <ProfileImagePreview
          imageUrl={pendingPhoto}
          onCancel={handleCancelPhoto}
          onConfirm={handleConfirmPhoto}
        />
      )}

      <Toast message={errorToast} onClose={hideErrorToast} />
    </div>
  );
};

export default ProfileEditPage;
