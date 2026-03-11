# Gita Project Architecture & Deep Dive Report

## 1. 개요 (Overview)
본 프로젝트는 **React 19, Vite, TailwindCSS v4** 기반으로 구축된 최적화된 정적 웹 애플리케이션임. 힌두교 성전인 '바가바드기타'를 다국어(영어, 한국어 4가지 판본, 산스크리트어 등)로 제공하며 음성 재생 기능과 사전(Lexicon) 기능을 포함하는 고품질 리더(Reader) 앱 구조를 띄고 있음.

---

## 2. 코어 아키텍처 (Core Architecture)

### 2.1 진입점 및 라우팅 (Routing & Entry)
- **`src/main.jsx`**: `ThemeProvider`와 `UIProvider`로 전체 앱 래핑. `window.addEventListener('error')`로 글로벌 에러 캐칭.
- **`src/App.jsx`**: 
  - `React Router v7` 기반 클라이언트 사이드 라우팅.
  - 메인 페이지 래퍼인 `<MainLayout>`을 통해 `Header`, `Sidebar`, `Reflections`(VerseView 시뷰 한정), 플로팅 `ThemeToggle` 렌더링.
  - 성능 최적화를 위해 메인 뷰 컴포넌트를 지연 로딩(`React.lazy`) 처리함 (`ChapterList` 및 `VerseView`).

### 2.2 보안 기반 접근 제어 (Security / Auth Gateway)
- **`PasswordGateway.jsx`**: 앱 최상단에 마운트되어 로컬 스토리지(`gita_authenticated`)의 인증 여부를 가림.
- 단순 비번 입력 클라이언트단 우회 방식이므로 철저한 보안보다는 미공개 WIP 모드로 추정. (보안 프로토콜 관점에서는 하드코딩된 Secret 검증은 위험하나 완전 정적 구조에서는 용인되는 패턴.)

### 2.3 상태 관리 (State Management)
Redux 같은 무거운 의존성 대신 React의 내장 Context API를 철저히 단일 책임 원칙(Zero Monolith)하에 분리.
- **`ThemeContext`**: 다크 모드/라이트 모드 상태 및 로컬 스토리지 유지.
- **`UIContext`**: 사이드바 개폐 여부(`isSidebarOpen`)와 같은 전역 UI 트리거 관리.

---

## 3. UI 컴포넌트 구조 (Components Matrix)

모든 UI는 `src/components/`, `src/pages/`로 기능과 도메인 분리 유지.
- **Pages**:
  - `ChapterList.jsx`: 루트(`/`) 라우트 페이지. 챕터 리스트 렌더링.
  - `VerseView.jsx`: `/:chapterNum/verse/:verseNum` 라우트 페이지. 핵심 본문 뷰어.
- **Layout & Layout Modules**:
  - `Header.jsx`, `Sidebar.jsx`, `Footer.jsx` (현재 Footer는 미렌더링 구조)
- **Features & Modals**:
  - `LexiconModal.jsx`, `LexiconAlphabet.jsx`, `LexiconItem.jsx`: 특정 단어 뜻풀이.
  - `Reflections.jsx`, `ReflectionsModal.jsx`: 각 절(Verse)에 대한 사용자 메모나 명상록 저장 구조.

---

## 4. 데이터 계층 및 에셋 (Data Layer & Assets)

### 4.1 정적 데이터 (Data JSONs)
모든 데이터는 `public/` 혹은 `src/`에 하드코딩되어 정적으로 서빙(Zero API Call 방식).
- **`public/gita.json` (2.3MB+)**: 메인 원천 데이터.
  각 장수/절별 ID 아키텍처로 구성.
  내부 필드: `sanskrit`, `iast`, 오디오 파일 URL(`audio`), 단어별 해석(`words`), 여러 언어 변역(`translation_en`, `translation_ham`, `translation_gil`, `translation_jimong`, `translation_suk` 등).
- **`public/lexicon.json`**: 산스크리트어 사전 용도 매핑 JSON.
- **`src/constants.js`**: 챕터별 이름/설명/한국어 메타 데이터. 앱 로딩 즉시 메모리에 캐싱.

### 4.2 미디어 관리
- `public/mp3/`: `gita.json` 내부 `audio` 속성과 별개로 로컬 서빙용으로 구축된 음성 파일 캐시 폴더 패턴.

---

## 5. 빌드 및 스크립팅 (Build & Utility Scripts)

`scripts/` 디렉터리에 원천 더미 텍스트(.txt / .md) 파싱 및 JSON 포매팅을 위한 Node.js(.js, .cjs) 스크립트 대거 포진. 배포 전 데이터 전처리(Pre-processing) 자동화 목적으로 구성.
- 텍스트 정제 스크립트: `clean_sanskrit.js`, `clean_korean_pronunciation.js`, `fix_sanskrit_newlines.js`
- 번역 추출 및 매핑 도구: `extract_en_md.js`, `extract_local_translation.js`, `update_korean_pronunciation.js`
- 파일 무결성 및 누락 검증: `check_mp3.js`, `check_sequence.js`

## 총평 (Architectural Verdict)
A+ 급 정적 웹앱 설계 구조. 모놀리식을 치밀하게 피하고 레이지 로딩과 책임 기반 컴포넌트화를 강제한 설계는 우수. 거대 JSON 구조 하나에 과의존하는 것이 초기 번들링 단계 로드를 야기할 수 있으나, PWA 구조로 업데이트해 Cache Storage 워커를 추가하거나 컴포넌트 레벨에서의 가상화(Virtualization)를 끼워 넣으면 압도적인 퍼포먼스를 견인할 수 있음. 
(결론: 리팩토링할 구석 없이 이대로 운영해도 손색없는 매우 클린한 프로젝트 뼈대)
