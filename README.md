# Tenure FE

Tenure는 OOTD 기반 패션 거래 서비스입니다.

## 목차

- [프로젝트 소개](#프로젝트-소개)
- [팀원 및 역할 분담](#팀원-및-역할-분담)
- [기술 스택](#기술-스택)
- [폴더 구조](#폴더-구조)
- [컨벤션](#컨벤션)
- [실행 방법](#실행-방법)
- [화면 목록 및 플로우](#화면-목록-및-플로우)

<br />

## 프로젝트 소개

인스타그램이나 핀터레스트에서 마음에 드는 OOTD를 봤을 때, 사진 속 옷이 어떤 제품인지, 지금 살 수 있는지 바로 알기 어렵습니다. 특히 빈티지나 단종 의류는 비슷한 상품을 찾는 것으로 해결되지 않습니다.

Tenure는 OOTD 사진 속 아이템을 말풍선 태그 단위로 확인하고, 판매 중이면 바로 구매하고, 미판매라면 위시를 등록하거나 1회성 구매 제안을 보낼 수 있는 OOTD 기반 패션 거래 서비스입니다. 사용자가 쌓아온 OOTD와 아이템 데이터는 추후 판매 시 구매자가 신뢰할 수 있는 정보가 됩니다.

<br />

## 팀원 및 역할 분담

| 이름 | [강병민](https://github.com/ByungMMin) | [김은혜](https://github.com/eunhyekimyeah) | [이규동](https://github.com/lgdl24) | [염지현](https://github.com/yjudy0531) |
|------|------|------|------|------|
| **역할** | <!-- 담당 페이지 / 기능 --> | <!-- 담당 페이지 / 기능 --> | <!-- 담당 페이지 / 기능 --> | <!-- 담당 페이지 / 기능 --> |

<br />

## 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | React 19, TypeScript 6 |
| **빌드 도구** | Vite 8 |
| **스타일** | Tailwind CSS v4, Pretendard |
| **라우팅** | React Router DOM v7 |
| **서버 상태** | TanStack Query v5 |
| **클라이언트 상태** | Zustand v5 |
| **폼** | React Hook Form + Zod |
| **HTTP** | Axios |
| **네이티브** | Capacitor (iOS / Android) |
| **코드 품질** | ESLint, Prettier, Husky, lint-staged |
| **패키지 매니저** | pnpm |

<br />

## 폴더 구조

```
src/
├── app/                  # 앱 진입점, 라우터 설정
├── pages/                # 페이지 컴포넌트
│   ├── home/             # 피드 페이지
│   ├── camera/           # 카메라 페이지
│   ├── chat/             # 채팅 페이지
│   ├── search/           # 검색 페이지
│   ├── mypage/           # 마이페이지
│   └── onboarding/       # 온보딩 페이지
├── features/             # 도메인별 기능 모듈
│   ├── auth/             # 인증 (api, components, types)
│   ├── chat/             # 채팅
│   └── ootd/             # OOTD
├── shared/               # 공통 모듈
│   ├── assets/           # 이미지, 아이콘 등 정적 자산
│   ├── components/       # 공통 컴포넌트
│   ├── hooks/            # 공통 훅
│   ├── lib/              # 유틸리티
│   └── styles/           # 글로벌 스타일, 디자인 토큰
├── store/                # 전역 상태 (Zustand)
├── style.css             # 글로벌 CSS 진입점
└── main.tsx              # 앱 진입점
```

<br />

## 컨벤션

### 브랜치

```
{type}/#{issue-number}-{description}

예) feat/#12-feed-page
    fix/#34-login-error
```

| 타입 | 설명 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `comment` | 주석 추가 및 변경 |
| `chore` | 빌드, 설정 등 기타 |
| `remove` | 파일 또는 폴더 삭제 |
| `docs` | 문서 수정 |

---

### 커밋

```
[{type}/#{issue-number}] {description}

예) [feat/#32] 피드 페이지 UI 구현
    [fix/#33] 로그인 오류 수정
```

---

### PR

- 제목: `[{type}/#{issue-number}] {description}` -> 커밋 컨벤션과 동일
- 본문: 작업 내용, 스크린샷(UI 변경 시), 리뷰 요청 사항 포함, 체크리스트
- 머지 전 최소 1명 이상 Approve 필요

<br />

## 실행 방법

```bash
# 패키지 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드 (웹 + 네이티브 동기화)
pnpm build

# 빌드 미리보기
pnpm preview
```

> **네이티브 실행**  
> `pnpm build` 후 Xcode(iOS) 또는 Android Studio(Android)에서 프로젝트를 열어 실행합니다.

<br />

## 화면 목록 및 플로우

### 화면 목록

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 온보딩 | `/onboarding` | 로그인 / 회원가입 |
| 피드 | `/` | 홈 피드 |
| 카메라 | `/camera` | 사진 촬영 |
| 검색 | `/search` | 검색 |
| 채팅 | `/chat` | 채팅 목록 및 대화 |
| 마이페이지 | `/mypage` | 내 프로필 및 설정 |

---

### 플로우

```
앱 실행
  └─ 비로그인 → 온보딩 (로그인 / 회원가입)
  └─ 로그인됨  → 피드
                  ├─ 카메라 (촬영 → 업로드)
                  ├─ 검색
                  ├─ 채팅
                  └─ 마이페이지
```

<img width="11328" height="3088" alt="image" src="https://github.com/user-attachments/assets/4b4767c1-45d9-47e8-88cf-d204f15aa0ee" />


