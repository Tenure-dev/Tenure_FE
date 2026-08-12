import { useCallback, useEffect, useRef, useState } from 'react';

type FacingMode = 'user' | 'environment';

// 후면에서 초광각(0.5x)/망원/심도 렌즈로 잡히는 것을 피하기 위한 라벨 키워드.
// (메인 렌즈는 보통 "wide"로 표기되므로 plain "wide"는 제외하지 않는다.)
const NON_MAIN_LENS = /ultra|telephoto|depth|초광각|망원|심도/i;

// 해상도는 센서 네이티브 방향(가로 4:3)으로 높게 요청한다.
// 세로로 강제하면 iOS가 크롭(확대)하지만, 가로 4:3은 센서 원본이라
// 화각을 유지한 채 고해상도를 줄 가능성이 크다. (세로 비율은 중앙 크롭으로 처리)
const RESOLUTION: MediaTrackConstraints = {
  width: { ideal: 1920 },
  height: { ideal: 1440 },
};

// 웹 카메라(getUserMedia) 제어 훅
// - 스트림 시작/정리, 전/후면 전환, 3:4 비율 캡처(dataURL)
export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('user');
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // 후면 카메라 중 메인(광각) 렌즈의 deviceId를 최대한 고른다.
  // (권한 허용 후에야 label이 채워지므로 첫 스트림 획득 뒤 호출)
  const pickBackMainDeviceId = useCallback(async (): Promise<string | undefined> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const back = devices.filter(
        (d) => d.kind === 'videoinput' && /back|rear|후면|environment/i.test(d.label),
      );
      if (!back.length) return undefined;

      // 안드로이드: 라벨이 "camera N" 인덱스 형태 → 후면 중 N이 가장 낮은 게 메인(보통 0)
      const indexed = back
        .map((d) => ({ d, idx: Number(d.label.match(/camera\s*(\d+)/i)?.[1] ?? NaN) }))
        .filter((x) => !Number.isNaN(x.idx));
      if (indexed.length) {
        indexed.sort((a, b) => a.idx - b.idx);
        return indexed[0].d.deviceId;
      }

      // iOS 등: 초광각/망원/심도가 아닌 후면 렌즈 우선
      const main = back.find((d) => !NON_MAIN_LENS.test(d.label));
      return (main ?? back[0]).deviceId;
    } catch {
      return undefined;
    }
  }, []);

  // facingMode 바뀔 때마다 스트림 재시작, 언마운트 시 정리
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        stop();

        // 1) facingMode + 해상도 제약으로 스트림 획득 (권한 획득 목적 포함)
        let stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, ...RESOLUTION },
          audio: false,
        });

        // 2) 후면이 메인 렌즈가 아니면 메인 deviceId로 교체
        //    - iOS: 라벨에 초광각/망원(NON_MAIN_LENS)일 때
        //    - 안드로이드: 라벨이 "camera N" 인덱스식이면 최저 인덱스(메인)로 맞춤
        if (!cancelled && facingMode === 'environment') {
          const track = stream.getVideoTracks()[0];
          const currentId = track?.getSettings?.().deviceId;
          const currentLabel = track?.label ?? '';
          const isAndroidLabel = /camera\s*\d+/i.test(currentLabel);
          const isNonMain = NON_MAIN_LENS.test(currentLabel);
          if (isNonMain || isAndroidLabel) {
            const mainId = await pickBackMainDeviceId();
            if (mainId && mainId !== currentId) {
              stream.getTracks().forEach((t) => t.stop());
              stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: mainId }, ...RESOLUTION },
                audio: false,
              });
            }
          }
        }

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setError(null);
      } catch {
        setError('카메라를 사용할 수 없어요. 브라우저 권한을 확인해주세요.');
      }
    };

    start();
    return () => {
      cancelled = true;
      stop();
    };
  }, [facingMode, stop, pickBackMainDeviceId]);

  const switchCamera = useCallback(() => {
    setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'));
  }, []);

  // 현재 프레임을 중앙 크롭해 dataURL 반환.
  // targetRatio(=W/H) = 최종 사진 비율. widthRatio = 가로 화각(줌) 기준 비율.
  // 예: 4:5를 3:4와 같은 줌으로 찍으려면 targetRatio=4/5, widthRatio=3/4
  //     → 가로는 3:4 크롭폭 그대로, 세로만 4:5로 덜 담음(줌 동일).
  const capture = useCallback(
    (targetRatio: number, widthRatio: number = targetRatio) => {
      const video = videoRef.current;
      if (!video) return null;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return null;

      // 가로 크롭폭은 widthRatio(=화각) 기준. 세로가 부족하면 세로 꽉 기준으로 가로 결정.
      let sw = vw;
      if (vw / widthRatio > vh) sw = vh * widthRatio;
      // 세로는 최종 비율(targetRatio)로. 프레임을 넘으면 클램프.
      let sh = sw / targetRatio;
      if (sh > vh) sh = vh;
      const sx = (vw - sw) / 2;
      const sy = (vh - sh) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // 전면 카메라는 미리보기가 좌우 반전이라 캡처도 동일하게 반전
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.9);
    },
    [facingMode],
  );

  return { videoRef, facingMode, error, switchCamera, capture, stop };
};

export default useCamera;
