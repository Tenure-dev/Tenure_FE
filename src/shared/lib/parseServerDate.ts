// 서버가 시각을 타임존 표기(Z/offset) 없이 UTC로 내려주는 경우가 있다.
// 그대로 new Date()에 넣으면 JS가 '로컬 시각'으로 오해해 KST(+9) 변환이 누락된다.
// → offset이 없으면 UTC로 간주해 Z를 붙여 파싱한다. (이미 Z/offset 있으면 그대로)
export const parseServerDate = (iso: string): Date =>
  new Date(/(Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`);
