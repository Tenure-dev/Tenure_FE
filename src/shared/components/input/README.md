# Input

텍스트 입력 공통 컴포넌트입니다.

## Props

| Prop                 | Type                                                            | Default         | 설명                                    |
| -------------------- | --------------------------------------------------------------- | --------------- | --------------------------------------- |
| `size`               | `54 \| 48 \| 44`                                                | `54`            | 높이 사이즈 (44는 앞에 검색 아이콘)     |
| `value`              | `string`                                                        | `undefined`     | 입력 값                                 |
| `onChange`           | `(e) => void`                                                   | `undefined`     | 값 변경 콜백                            |
| `placeholder`        | `string`                                                        | `입력하는 경우` | 미입력 시 표시 텍스트                   |
| `error`              | `boolean`                                                       | `false`         | 에러 상태 (빨간 테두리)                 |
| `completion`         | `boolean`                                                       | `false`         | 입력 완료 상태                          |
| `disabled`           | `boolean`                                                       | `false`         | 비활성화 여부                           |
| `type`               | `string`                                                        | `text`          | input type (`password` 시 눈 토글 노출) |
| `leftIcon`           | `ReactNode`                                                     | `undefined`     | 앞쪽 아이콘 (미지정 시 size 44는 검색)  |
| `onClear`            | `() => void`                                                    | `undefined`     | 지우기(×) 버튼 콜백                     |
| `showClear`          | `boolean`                                                       | `true`          | 지우기 버튼 노출 여부                   |
| `showPasswordToggle` | `boolean`                                                       | `-`             | 눈 토글 강제 노출/숨김                  |
| `state`              | `default \| focus \| active \| error \| completion \| disabled` | 자동            | 상태 강제 지정 (보통 사용 안 함)        |

## States

`state`는 보통 직접 넘기지 않습니다. `value`·포커스·`error`·`disabled`를 보고 내부에서 자동 계산됩니다.

| 상태         | 조건                   | 테두리                      |
| ------------ | ---------------------- | --------------------------- |
| `default`    | 값 없음, 포커스 아님   | `border-border`             |
| `focus`      | 포커스 중              | `border-brand` + focus glow |
| `active`     | 값 있음, 포커스 벗어남 | `border-border-strong`      |
| `error`      | `error={true}`         | `border-error`              |
| `completion` | `completion={true}`    | `border-border`             |
| `disabled`   | `disabled={true}`      | `bg-bg-100`, 클릭 불가      |

지우기(×)·비밀번호 토글(👁) 아이콘은 `focus`/`active`/`error` 상태에서만 노출됩니다.

## 기본 사용법

```tsx
import { useState } from 'react';
import { Input } from '@/shared/components';

const Example = () => {
  const [email, setEmail] = useState('');
  return (
    <Input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="이메일을 입력하세요"
    />
  );
};
```

## Size 48 / 44

```tsx
<Input size={48} value={value} onChange={onChange} />
<Input size={44} value={value} onChange={onChange} placeholder="검색" /> {/* 앞에 검색 아이콘 자동 */}
```

### 사이즈 선택 가이드

- **아이디 · 이메일 · 비밀번호 등 일반 입력** → `54` 또는 `48` 사용 (로그인/회원가입은 보통 `54`)
- **검색창** → `44` 사용 (앞에 돋보기 아이콘 자동 노출)

`44`는 기본으로 검색 아이콘이 붙습니다. 검색이 아닌 용도로 `44`를 쓰고 싶다면 `leftIcon={null}`로 아이콘을 끌 수 있습니다.

```tsx
<Input size={44} leftIcon={null} placeholder="아이디" /> {/* 돋보기 없이 44 높이만 */}
```

## 에러

```tsx
<Input value={email} onChange={(e) => setEmail(e.target.value)} error={!isValid} />
```

## 비밀번호

```tsx
<Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
```

## 지우기 버튼

```tsx
<Input value={text} onChange={(e) => setText(e.target.value)} onClear={() => setText('')} />
```

## 완료 / 비활성

```tsx
<Input value="확정된 값" completion disabled />
```

## react-hook-form 연동

```tsx
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/shared/components';

const { control } = useForm<{ email: string }>();

<Controller
  name="email"
  control={control}
  render={({ field }) => (
    <Input value={field.value} onChange={field.onChange} placeholder="이메일" />
  )}
/>;
```
