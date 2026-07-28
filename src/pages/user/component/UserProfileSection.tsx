import profileDefault from '@/shared/assets/profileDefault.svg';
import { userProfile } from '../mock';

// 타인 프로필이므로 로그인 사용자 스토어(useProfileStore)가 아니라 조회 대상 데이터를 쓴다.
const UserProfileSection = () => {
  const { name, grade, height, weight } = userProfile;

  return (
    <div className="flex items-center gap-4 px-4 py-6">
      <img
        src={profileDefault}
        alt=""
        className="bg-bg-quaternary size-24 rounded-full object-cover"
      />
      <div>
        <p className="text-title-1">{name}</p>
        <p className="text-body-2 text-text-secondary">
          {grade} | {height}cm · {weight}kg
        </p>
      </div>
    </div>
  );
};

export default UserProfileSection;
