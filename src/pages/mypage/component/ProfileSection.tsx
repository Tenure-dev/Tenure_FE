import { useNavigate } from 'react-router-dom';
import edit from '@/shared/assets/edit.svg';
import profileDefault from '@/shared/assets/profileDefault.svg';
import { useProfileStore } from '@/store/useProfileStore';
import { useMyPage } from '@/features/mypage/api/useMyPage';
import { USER_GRADE_LABEL } from '@/features/mypage/api/dto';

const ProfileSection = () => {
  const navigate = useNavigate();
  const { name, height, weight, photoUrl } = useProfileStore();
  const { data: myPage } = useMyPage();
  const gradeLabel = myPage ? USER_GRADE_LABEL[myPage.grade] : '';

  return (
    <div className="flex items-center gap-4 px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/mypage/edit')}
        className="relative"
        aria-label="프로필 수정"
      >
        <img
          src={photoUrl ?? profileDefault}
          alt=""
          className="bg-bg-200 size-24 rounded-full object-cover"
        />
        <div className="bg-bg-white/50 absolute -right-0 -bottom-0 flex size-6 -translate-x-1 items-center justify-center rounded-full">
          <img src={edit} width={12} height={12} alt="" />
        </div>
      </button>
      <div>
        <p className="text-title-1">{name}</p>
        <p className="text-body-2 text-text-secondary">
          {gradeLabel} | {height}cm · {weight}kg
        </p>
      </div>
    </div>
  );
};

export default ProfileSection;
