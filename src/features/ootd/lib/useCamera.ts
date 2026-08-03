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
  const [debugLabel, setDebugLabel] = useState<string>(''); // [임시] 화면에 렌즈 라벨 표시

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  // 후면 카메라 중 메인(광각) 렌즈의 deviceId를 최대한 고른다.
  // (권한 허용 후에야 label이 채워지므로 첫 스트림 획득 뒤 호출)
  const pickBackMainDeviceId = useCallback(async (): Promise<string | undefined> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === 'videoinput');
      const back = cams.filter((d) => /back|rear|후면|environment/i.test(d.label));
      const pool = back.length ? back : cams;
      // 초광각/망원/심도 라벨이 없는 후면 렌즈 우선
      const main = pool.find((d) => d.label && !NON_MAIN_LENS.test(d.label));
      return (main ?? pool[0])?.deviceId || undefined;
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

        // 2) 후면인데 초광각/망원 등으로 잡혔으면 메인 렌즈 deviceId로 교체 시도
        if (!cancelled && facingMode === 'environment') {
          const currentLabel = stream.getVideoTracks()[0]?.label ?? '';
          if (NON_MAIN_LENS.test(currentLabel)) {
            const deviceId = await pickBackMainDeviceId();
            if (deviceId) {
              stream.getTracks().forEach((track) => track.stop());
              stream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId }, ...RESOLUTION },
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

        // [임시 디버그] 실제 선택된 카메라 렌즈를 화면에 표시 — 확인 끝나면 삭제
        const activeTrack = stream.getVideoTracks()[0];
        const settings = activeTrack?.getSettings?.() ?? {};
        const zoom = (settings as { zoom?: number }).zoom;
        setDebugLabel(
          `${activeTrack?.label || '(라벨없음)'} | ${settings.width}x${settings.height}` +
            (zoom != null ? ` | zoom:${zoom}` : ''),
        );
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

  // 현재 프레임을 지정 비율(가로/세로)로 중앙 크롭해 dataURL 반환
  const capture = useCallback(
    (targetRatio: number) => {
      const video = videoRef.current;
      if (!video) return null;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return null;

      // 프리뷰(object-cover)와 동일하게, targetRatio(=W/H)에 맞춰 중앙 크롭.
      // 세로가 부족하면 세로를 꽉 쓰고 가로를 크롭(가로가 부족하면 반대).
      let sw = vw;
      let sh = vw / targetRatio;
      if (sh > vh) {
        sh = vh;
        sw = vh * targetRatio;
      }
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

  return { videoRef, facingMode, error, switchCamera, capture, stop, debugLabel };
};

export default useCamera;
