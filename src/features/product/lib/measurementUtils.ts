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
      value: `${measurements[key]}cm`,
    }));

  if (fields.length === 0) return null;

  return { title: `실측 입력 · ${categoryLarge}`, fields };
}
