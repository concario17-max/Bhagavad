# UI Migration Plan (Meta-Design Level)

이 문서는 현재 `gita` 프로젝트에 적용된 프리미엄 다크/골드 메타 디자인 UI와 뷰를 타 프로젝트에 이식하기 위한 완벽히 세분화된 TODO 리스트임.
단일 책임 원칙(Zero Monolith)과 O(1) 상태 접근을 전제로 작성됨.

## 1. 기반 공사 (Foundation Layer)
이식 대상 프로젝트의 핵심 스타일링 및 인프라 구축.

- [x] Tailwind CSS v4.x 마이그레이션 설치 및 초기화
- [x] `index.css` 핵심 유틸리티 이식
  - [x] 전역 `body`, `html`, 글꼴 기본화 (Inter, Noto Serif KR 등 폰트 패밀리 이식)
  - [x] `@theme` (또는 `tailwind.config.js`) 변수 이식 (골드/다크 테마 토큰: `gold-bg`, `dark-bg`, `gold-primary` 등)
  - [x] 커스텀 스크롤바(`custom-scrollbar`) css 이식
- [x] SVG/Icon 의존성 설치 (`lucide-react`)
- [x] 에셋 이식 (폰트 파일, `favicon.png`, `gita_header_icon.png` 등 로고류)

## 2. 전역 상태 래핑 (Context Providers)
의존성을 줄이고 컴포넌트 재사용성을 극대화하기 위한 컨텍스트 분리 이식.

- [x] `src/context/ThemeContext.jsx` 이식
  - [x] 로컬스토리지 기반 `dark`/`light` 모드 토글 로직 복사
  - [x] `<html class="dark">` 삽입 사이드 이펙트(Effect) 재현
- [x] `src/context/UIContext.jsx` 이식
  - [x] 사이드바(`isSidebarOpen`) 같은 전역 토글 상태 추상화 (예: `MenuContext`로 범용화)
- [x] `main.jsx` 최상단에 Provider 래핑 처리

## 3. 코어 UI 컴포넌트 이식 (Core Reusable Components)
도메인에 종속되지 않는 순수 프레젠테이셔널(Presentational) 컴포넌트만 추출하여 이식.

- [x] `ThemeToggle.jsx` 이식 (글래스모피즘이 적용된 플로팅 테마 전환 버튼)
- [x] `Header.jsx` 범용화 후 이식
  - [x] 로고, 테마 토글 버튼, 타이틀 프롭(`title`)화
  - [x] 도메인 텍스트 분리
- [ ] `Sidebar.jsx` (Navigation) 이식
  - [ ] 배경 블러 효과 및 오버레이 트랜지션 로직 추출
  - [ ] 라우팅 로직을 독립적인 `navItems` 배열 프롭스로 리팩토링하여 적용 가능하게 구상
- [x] `PasswordGateway.jsx` 및 `GatewayInput.jsx` 이식 (보안 프로토콜 검증 통과한 범용 패스워드 락 스크린용)

## 4. 페이지 및 레이아웃 구조 (Layout & Pages)
레이지 로딩과 서스펜스를 활용한 뼈대 이식.

- [ ] `MainLayout` 패턴 적용 (`App.jsx` 내부)
  - [ ] 100dvh 하드 코딩, 고화질 Radial Gradient 스포트라이트 배경 이식
  - [ ] 상단/사이드/본문을 가르는 `flex-1` 레이아웃 구조 재현
- [ ] 카드/리스트 그리드 레이아웃 패턴 추출 (현 `ChapterList.jsx`의 UI 그리드)
- [ ] 컨텐츠 리더 뷰 패턴 추출 (현 `VerseView.jsx`의 양식: 상단 컨트롤러, 중앙 텍스트, 하단 여백)

## 5. 애니메이션 및 UX 디테일 (Micro-Animations & UX)
코드포스 그랜드마스터급의 섬세함을 결정하는 메타 디자인 폴리싱.

- [ ] 선택 영역(Selection) 색상 오버라이드 이식 (`selection:bg-gold-primary/20` 등)
- [ ] 컴포넌트 등장 모션(`Framer Motion` 도입 검토 또는 Tailwind `animate-in` 활용)
- [ ] 호버 시 테두리 그라디언트 및 글래스모피즘(`backdrop-blur`) 미세 튜닝

## 6. 보안 및 성능 점검 (Security & Performance Audit)
이식 시 방만하게 짜진 코드 쳐내기.

- [ ] 모든 onClick 핸들러에 쓰로틀/디바운스 적용 여부 검토
- [ ] 무의미하게 리렌더링되는 UI 컴포넌트 `React.memo` 또는 `useMemo` 처리
- [x] 패스워드 게이트웨이에 하드코딩된 비밀번호 제거 및 `.env` 마이그레이션 필수 설계
