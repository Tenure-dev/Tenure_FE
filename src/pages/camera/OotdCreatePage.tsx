import { useLocation, useNavigate } from 'react-router-dom';
import TagLoading from './component/TagLoading';
import { useCreateOotd } from '@/features/ootd/api/useCreateOotd';
import { useCreateManualOotd } from '@/features/ootd/api/useCreateManualOotd';
import { useOotdDraftStore } from '@/store/useOotdDraftStore';
import { dataUrlToFile } from '@/shared/lib/dataUrlToFile';
import BackHeader from '@/shared/components/BackHeader';

const OotdCreatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const photo = (location.state as { photo?: string } | null)?.photo ?? null;
  /*------------------------------------------------------------- */
  const { mutate: createOotd, isPending } = useCreateOotd();
  const { mutate: createManual, isPending: creatingManual } = useCreateManualOotd();
  const { photo: draftPhoto, ootdId: draftOotdId, setDraft } = useOotdDraftStore();

  const handlePost = () => {
    if (!photo) return;
    const image = dataUrlToFile(photo, 'ootd.jpg');
    createOotd(image, {
      onSuccess: (res) => {
        // 자동태그 게시 → 상세로 이동. 상세에서 AI 태그 준비되면 자동 확정(confirm)된다.
        // fromPublish: 상세에서 뒤로가기 시 작성 화면이 아니라 피드로 보내기 위함.
        navigate(`/ootd/${res.ootdId}`, { state: { toast: '게시되었습니다.', fromPublish: true } });
      },
      onError: () => {
        navigate('/feed', { state: { toast: '게시에 실패하였습니다.' } });
      },
    });
  };

  // 태그 작성: manual-tag로 임시 비공개 OOTD를 만들어 ootdId를 확보한 뒤 태그 작성 화면으로 이동.
  // 같은 사진으로 이미 만든 임시 OOTD가 있으면 재사용해 중복 생성을 막는다.
  const handleTagWrite = () => {
    if (!photo) return;
    if (draftOotdId != null && draftPhoto === photo) {
      navigate('/ootd/tag', { state: { photo, ootdId: draftOotdId } });
      return;
    }
    const image = dataUrlToFile(photo, 'ootd.jpg');
    createManual(image, {
      onSuccess: (ootdId) => {
        setDraft(photo, ootdId);
        navigate('/ootd/tag', { state: { photo, ootdId } });
      },
      onError: () => {
        navigate('/feed', { state: { toast: '태그 작성 준비에 실패했어요.' } });
      },
    });
  };
  /*------------------------------------------------------------- */
  if (isPending || creatingManual) {
    return (
      <div className="bg-bg-white flex h-dvh w-full flex-col">
        {creatingManual ? (
          // 태그 작성 준비: 문구 표시 x
          <TagLoading />
        ) : (
          // 자동 게시: 문구
          <TagLoading title="태그를 작성할 준비를 하고 있어요!" subtitle="잠시만 기다려 주세요!" />
        )}
      </div>
    );
  }

  return (
    <div className="bg-bg-white text-text-primary flex min-h-dvh flex-col">
      {/* 헤더 */}
      <BackHeader title="새 게시물 작성" />

      {/* 진행바 */}
      <div className="bg-bg-tertiary h-1 w-full">
        <div className="bg-brand h-full w-1/3" />
      </div>

      {/* 사진: 원본 비율 그대로 헤더 아래에 붙임 (여백 없음) */}
      {photo ? (
        <img src={photo} alt="촬영한 사진" className="block w-full" />
      ) : (
        <div className="bg-gray-bg flex aspect-square items-center justify-center">
          <span className="text-body-3 text-text-secondary">사진이 없어요</span>
        </div>
      )}

      {/* 안내 문구 (사진 바로 아래) */}
      <p className="text-body-3 text-warning p-4 text-center font-medium">
        게시하기를 누르면 사진 속 아이템이 자동으로 태그돼요.
      </p>

      {/* 하단 버튼 (하단 고정) */}
      <div className="mt-auto flex gap-2 px-5 pb-6">
        <button
          type="button"
          onClick={handleTagWrite}
          className="bg-gray-bg text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
        >
          태그 작성
        </button>
        <button
          type="button"
          onClick={handlePost}
          className="bg-brand text-btn-2 text-text-primary flex-1 rounded-md py-3.5 font-medium"
        >
          게시하기
        </button>
      </div>
    </div>
  );
};

export default OotdCreatePage;
