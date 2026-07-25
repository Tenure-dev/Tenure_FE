import { useCallback, useEffect, useRef, useState } from 'react';

type FacingMode = 'user' | 'environment';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('user');
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        stop();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: false,
        });
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
  }, [facingMode, stop]);

  const switchCamera = useCallback(() => {
    setFacingMode((mode) => (mode === 'user' ? 'environment' : 'user'));
  }, []);

  const capture = useCallback(
    (targetRatio: number) => {
      const video = videoRef.current;
      if (!video) return null;

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return null;

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
