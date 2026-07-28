// data URL(base64) → File. 카메라(canvas.toDataURL) 결과를 multipart 업로드용으로 변환.
export const dataUrlToFile = (dataUrl: string, filename: string): File => {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';

  const binary = atob(base64); // base64 디코드
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new File([bytes], filename, { type: mime });
};
