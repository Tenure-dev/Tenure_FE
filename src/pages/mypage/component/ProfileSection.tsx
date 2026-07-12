import edit from '@/shared/assets/edit.svg';
import { profile } from '../mock';

const ProfileSection = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-6">
      <div className="relative">
        <div className="bg-bg-200 size-24 rounded-full" />
        <div className="bg-bg-white/50 absolute -right-0 -bottom-0 flex size-6 -translate-x-1 items-center justify-center rounded-full">
          <img src={edit} width={12} height={12} alt="편집" />
        </div>
      </div>
      <div>
        <p className="text-title-1">{profile.name}</p>
        <p className="text-body-2 text-text-secondary">
          {profile.grade} | {profile.height}cm · {profile.weight}kg
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
