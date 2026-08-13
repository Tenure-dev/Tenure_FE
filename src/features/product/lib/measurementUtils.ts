import type { Measurements } from '../model/types';

export const MEASUREMENT_LABELS: Record<keyof Measurements, string> = {
  shoulderWidth: '어깨 너비',
  chestWidth: '가슴 단면',
  sleeveLength: '소매 기장',
  totalLength: '총 기장',
  waistWidth: '허리 단면',
  thighWidth: '허벅지 단면',
  rise: '밑위',
  inseam: '인심',
  hemWidth: '밑단',
  hipWidth: '엉덩이 단면',
};

export const CATEGORY_FIELDS: Record<string, (keyof Measurements)[]> = {
  아우터: ['shoulderWidth', 'chestWidth', 'sleeveLength', 'totalLength'],
  상의: ['shoulderWidth', 'chestWidth', 'sleeveLength', 'totalLength'],
  원피스: ['shoulderWidth', 'chestWidth', 'sleeveLength', 'totalLength'],
  하의: ['waistWidth', 'thighWidth', 'totalLength', 'rise', 'inseam', 'hemWidth'],
  치마: ['waistWidth', 'hipWidth', 'hemWidth', 'totalLength'],
};

export function getMeasurementSection(
  categoryLarge: string,
  measurements: Measurements | undefined,
): { title: string; fields: { label: string; value: string }[] } | null {
  const fieldKeys = CATEGORY_FIELDS[categoryLarge];
  if (!fieldKeys || !measurements) return null;

  const fields = fieldKeys
    .filter((key) => measurements[key] !== undefined)
    .map((key) => ({
      label: MEASUREMENT_LABELS[key],
      //0(=미입력)이면 실측값 대신 '-'로 표시한다.
      value: measurements[key] ? `${measurements[key]}cm` : '-',
    }));

  if (fields.length === 0) return null;

  return { title: `실측 입력 · ${categoryLarge}`, fields };
}

// 판매 등록/수정 제출용 실측 페이로드를 만든다.
// 카테고리에 실측 필드가 없으면(신발/가방 등) undefined, 있으면 미입력 필드는 0으로 채워 항상 전체 필드를 채워 보낸다.
// (백엔드가 카테고리별 실측 필드 존재 자체를 요구해서, 일부만 보내면 검증 오류가 남)
export function buildMeasurementsPayload(
  categoryLarge: string,
  formMeasurements: Partial<Record<keyof Measurements, string>>,
): Measurements | undefined {
  const fieldKeys = CATEGORY_FIELDS[categoryLarge];
  if (!fieldKeys) return undefined;

  return Object.fromEntries(
    fieldKeys.map((key) => {
      const raw = formMeasurements[key];
      return [key, raw !== undefined && raw !== '' ? Number(raw) : 0];
    }),
  ) as Measurements;
}
