# SelectBox

드롭다운 선택 공통 컴포넌트입니다.

## Props

| Prop          | Type                      | Default         | 설명                  |
| ------------- | ------------------------- | --------------- | --------------------- |
| `options`     | `SelectOption[]`          | —               | 드롭다운 옵션 목록    |
| `value`       | `string`                  | `undefined`     | 선택된 값             |
| `onChange`    | `(value: string) => void` | `undefined`     | 값 변경 콜백          |
| `placeholder` | `string`                  | `입력하는 경우` | 미선택 시 표시 텍스트 |
| `disabled`    | `boolean`                 | `false`         | 비활성화 여부         |
| `size`        | `54 \| 48`                | `54`            | 높이 사이즈           |

## States

테두리 색상은 모든 상태에서 `border-border-secondary`로 동일합니다.

| 상태         | 조건              | 스타일                                        |
| ------------ | ----------------- | --------------------------------------------- |
| `default`    | 값 없음, 닫힘     | 흰 배경, 모서리 전체 둥글게                   |
| `completion` | 값 있음, 닫힘     | 흰 배경, 모서리 전체 둥글게                   |
| `active`     | 드롭다운 열림     | 흰 배경, 상단 모서리만 둥글게, 옵션 목록 표시 |
| `disabled`   | `disabled={true}` | 회색 배경, 클릭 불가                          |

드롭다운 옵션 목록은 `absolute` 포지션으로 렌더링되어 아래 UI를 밀지 않습니다.
옵션 터치 시 `active:bg-gray-press`로 눌림 피드백을 제공합니다.

## 기본 사용법

```tsx
import { useState } from 'react';
import { SelectBox, type SelectOption } from '@/shared/components';

const options: SelectOption[] = [
  { value: 'cj', label: 'CJ대한통운' },
  { value: 'post', label: '우체국택배' },
  { value: 'gs', label: 'GS Postbox' },
  { value: 'cu', label: 'CU 편의점택배' },
];

const Example = () => {
  const [value, setValue] = useState('');

  return <SelectBox options={options} value={value} onChange={setValue} />;
};
```

## Size 48

```tsx
<SelectBox options={options} value={value} onChange={setValue} size={48} />
```

## Disabled

```tsx
<SelectBox options={options} value={value} onChange={setValue} disabled />
```

## Custom Placeholder

```tsx
<SelectBox options={options} value={value} onChange={setValue} placeholder="택배사를 선택하세요" />
```

## react-hook-form 연동

```tsx
import { Controller, useForm } from 'react-hook-form';
import { SelectBox } from '@/shared/components';

const { control } = useForm<{ delivery: string }>();

<Controller
  name="delivery"
  control={control}
  render={({ field }) => (
    <SelectBox options={options} value={field.value} onChange={field.onChange} />
  )}
/>;
```
