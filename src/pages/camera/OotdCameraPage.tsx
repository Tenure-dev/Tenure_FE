import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/cn';
import useCamera from '@/features/ootd/lib/useCamera';
import chevron from '@/shared/assets/chevron-left.svg';
import shootButton from '@/shared/assets/shootbutton.svg';
import switchButton from '@/shared/assets/switch.svg';
import ratio34 from '@/shared/assets/3-4.svg';
import ratio45 from '@/shared/assets/4-5.svg';
import ratio11 from '@/shared/assets/1-1.svg';
import close from '@/shared/assets/close.svg';
import next from '@/shared/assets/next.svg';

// 탭 시 순환하는 촬영 비율 (value = 가로/세로)
const RATIOS = [
  { label: '3:4', icon: ratio34, value: 3 / 4, aspect: 'aspect-[3/4]' },
  { label: '4:5', icon: ratio45, value: 4 / 5, aspect: 'aspect-[4/5]' },
  { label: '1:1', icon: ratio11, value: 1, aspect: 'aspect-square' },
] as const;

const OotdCameraPage = () => {
  const navigate = useNavigate();
  const { videoRef, facingMode, error, switchCamera, capture } = useCamera();
  const [captured, setCaptured] = useState<string | null>(null);
  const [ratioIndex, setRatioIndex] = useState(0);
  const ratio = RATIOS[ratioIndex];

  const cycleRatio = () => setRatioIndex((i) => (i + 1) % RATIOS.length);

  const handleShoot = () => {
    const photo = capture(ratio.value);
    if (photo) setCaptured(photo);
  };

  const handleNext = () => {
    if (captured) navigate('/ootd/create', { state: { photo: captured } });
  };

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-black text-white">
      {/* 헤더 */}
      <header className="flex items-center gap-3 px-5 py-3">
        {captured ? (
          <button type="button" onClick={() => setCaptured(null)} aria-label="닫기">
            <img src={close} width={24} height={24} alt="" className="brightness-0 invert" />
          </button>
        ) : (
          <>
            <button type="button" onClick={() => navigate(-1)} aria-label="뒤로">
              <img src={chevron} width={24} height={24} alt="" className="brightness-0 invert" />
            </button>
            <h1 className="text-title-2 font-regular">OOTD 촬영</h1>
          </>
        )}
      </header>

      {/* 프리뷰 영역: 남은 공간에 맞춰 최대 높이 제한 (화면 밖으로 안 넘침) */}
      <div className="mt-7 flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          className="relative w-full overflow-hidden bg-black"
          // iOS Safari는 flex 아이템의 aspect-ratio를 종종 무시해서,
          // padding-bottom 퍼센트(= 100/(가로/세로))로 높이를 확실히 만든다.
          style={{ height: 0, paddingBottom: `${100 / ratio.value}%` }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cn(
              // 비율 박스를 꽉 채우고 넘치는 부분은 중앙 크롭 → 촬영 결과와 일치(WYSIWYG)
              'absolute inset-0 size-full object-cover',
              facingMode === 'user' && '-scale-x-100',
              captured && 'hidden',
            )}
          />
          {captured && (
            <img
              src={captured}
              alt="촬영한 사진"
              className="absolute inset-0 size-full object-cover"
            />
          )}

          {error && !captured && (
            <p className="text-body-3 absolute inset-x-0 bottom-4 px-4 text-center text-white/80">
              {error}
            </p>
          )}

          {/* 비율 버튼: 프리뷰 우상단 고정 */}
          {!captured && (
            <button
              type="button"
              onClick={cycleRatio}
              aria-label={`촬영 비율 ${ratio.label}, 탭하여 변경`}
              className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-lg bg-black/50"
            >
              <img src={ratio.icon} alt={ratio.label} />
            </button>
          )}
        </div>
      </div>

      {/* 컨트롤 영역: 고정 높이 (비율 바뀌어도 촬영버튼 위치 고정) */}
      <div className="relative flex h-36 shrink-0 items-center justify-center">
        {captured ? (
          <button
            type="button"
            onClick={handleNext}
            aria-label="다음"
            className="bg-brand absolute right-6 bottom-6 flex size-14 items-center justify-center rounded-full"
          >
            <img src={next} width={24} height={24} alt="" />
          </button>
        ) : (
          <>
            <button type="button" onClick={handleShoot} aria-label="촬영">
              <img src={shootButton} width={84} height={84} alt="" />
            </button>
            <button
              type="button"
              onClick={switchCamera}
              aria-label="카메라 전환"
              className="absolute right-10"
            >
              <img src={switchButton} width={44} height={44} alt="" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OotdCameraPage;
