# Bhagavad 프로젝트 심층 분석 보고서

## 1. 분석 범위

이 문서는 `C:\Users\roadsea\Desktop\nagham` 전체를 기준으로 다음을 파악한 결과다.

- 프로젝트가 어떤 구조로 동작하는지
- 라우팅, 레이아웃, 데이터, 상태 관리가 어떻게 연결되는지
- 대문 페이지에서 위쪽으로 이동이 안 되는 현상의 실제 원인
- 현재 코드베이스에 있는 추가 리스크와 배포 전제

이번 분석은 코드와 정적 자산을 직접 읽어 정리한 것이며, `node_modules`가 없는 상태라 실제 빌드 실행 검증은 하지 못했다.

## 2. 프로젝트 한줄 요약

이 저장소는 React 19 + Vite + Tailwind v4 + React Router 기반의 Bhagavad Gita 리더 앱이다. 서버 API 없이 `public/gita.json`, `public/lexicon.json`, `public/mp3/*` 같은 정적 파일을 직접 읽고, 사용자 설정과 메모는 `localStorage`에 저장한다.

핵심 사용자 흐름은 아래와 같다.

1. 앱 진입
2. 비밀번호 게이트 통과
3. 대문(`/`)에서 챕터 선택
4. 구절 페이지(`/chapter/:chapterNum/verse/:verseNum`)에서 본문, 번역, 오디오, 단어 해설, 개인 메모 사용

## 3. 실행 구조

### 3.1 진입점

- `src/main.tsx`
  - `ThemeProvider`, `UIProvider`로 앱 전체를 감싼다.
  - 전역 에러 이벤트를 `console.error`로 기록한다.
- `src/App.tsx`
  - `BrowserRouter`를 사용한다.
  - 인증 여부를 `localStorage['gita_authenticated']`로 확인한다.
  - 인증 전에는 `PasswordGateway`만 렌더링한다.
  - 인증 후에는 `MainLayout` 안에서 실제 라우트를 렌더링한다.

### 3.2 라우트

`src/App.tsx` 기준 현재 라우트는 두 개다.

- `/` -> `ChapterList`
- `/chapter/:chapterNum/verse/:verseNum` -> `VerseView`

라우트 컴포넌트는 `React.lazy`로 지연 로딩된다.

## 4. 레이아웃 구조

### 4.1 AppShell

핵심 레이아웃은 `src/components/ui/AppShell.tsx`가 담당한다.

중요한 구조:

- 루트 컨테이너가 `h-[100dvh]` 고정 높이
- 최상위와 내부 래퍼 모두 `overflow-hidden`
- 실제 스크롤은 `main` 요소에서만 발생
- `main`에 `flex flex-col justify-center min-h-full overflow-y-auto` 적용

즉 이 앱은 브라우저 `window` 자체가 아니라, 내부 `main`을 스크롤 컨테이너로 쓰는 구조다.

이 점이 대문 스크롤 이슈와 바로 연결된다.

### 4.2 페이지별 레이아웃 차이

- 홈(`/`)
  - `Header`, `Sidebar`, `Reflections` 없음
  - 우하단에 `ThemeToggle`만 떠 있음
- 구절 페이지
  - 상단 `Header`
  - 좌측 `Sidebar`
  - 우측 `Reflections`
  - 본문은 `ContentReader` 안에 들어감

## 5. 페이지 동작 상세

### 5.1 ChapterList

`src/pages/ChapterList.tsx`

역할:

- `fetchGitaData()`로 챕터 목록을 불러옴
- 상단 히어로 섹션과 챕터/구절 셀렉트 표시
- 챕터 카드 그리드 렌더링
- `Compendium`, `Lexicon`, `Commentaries` 모달 열기

특징:

- 데이터는 `Object.values(data)`로 배열화
- 챕터를 선택하면 그 챕터의 verse 목록을 select에 채움
- 구절 선택 시 `navigate('/chapter/...')`
- 카드 클릭도 첫 구절로 이동

### 5.2 VerseView

`src/pages/VerseView.tsx`

역할:

- URL 파라미터로 현재 챕터/구절 결정
- `gita.json`에서 실제 표시할 구절을 찾음
- 산스크리트, IAST, 한국어 발음, 오디오, 단어별 해설, 번역, 해설 표시
- 이전/다음 구절 이동

특징:

- URL의 verse 번호가 구간 시작 verse가 아니어도 가장 가까운 실제 verse 시작점으로 보정
- `showLexicon`은 `localStorage['gita-show-lexicon']`에 저장
- 오디오 소스는 원격 URL에서 파일명만 뽑아 `/mp3/<filename>`로 재매핑

주의할 점:

- 스크롤 리셋이 `window.scrollTo(0, 0)`로 되어 있는데, 실제 스크롤 컨테이너는 `window`가 아니라 `main`이다. 따라서 현재 구현은 의도와 다르게 동작할 가능성이 높다.

## 6. 상태 관리

### 6.1 ThemeContext

`src/context/ThemeContext.tsx`

- 테마는 `light`/`dark`
- 기본값은 `light`
- `localStorage['theme']`를 읽고 저장
- `<html>`에 `dark` 클래스를 붙이는 방식

### 6.2 UIContext

`src/context/UIContext.tsx`

관리 상태:

- 모바일 사이드바 열림 여부
- 모바일 reflections 패널 열림 여부
- 데스크탑 사이드바 열림 여부
- 데스크탑 reflections 패널 열림 여부

특징:

- 데스크탑 패널 상태는 `localStorage`에 유지
- 모바일에서는 drawer 토글
- 데스크탑에서는 패널 폭 0/정상폭 전환

## 7. 데이터 계층

### 7.1 gita.json

`public/gita.json`

구조:

- 최상위는 챕터 번호 문자열 키
- 각 챕터 안에 `verses` 배열
- 각 verse는 다음 필드를 가질 수 있음
  - `id`
  - `chapter`
  - `verse`
  - `sanskrit`
  - `iast`
  - `korean_pronunciation`
  - `audio`
  - `words`
  - 여러 번역 필드
  - `commentary_en`

로딩 방식:

- `src/utils/dataFetcher.ts`에서 `/gita.json`을 fetch
- Promise를 모듈 스코프에 캐시해서 중복 fetch를 줄임

### 7.2 lexicon.json

`public/lexicon.json`

- 알파벳별 단어 배열 구조
- `LexiconModal`이 처음 열릴 때만 fetch

### 7.3 mp3 자산

`public/mp3/*`

- verse 또는 verse range 기준 파일명
- `VerseView`는 gita 데이터의 원격 URL을 직접 쓰지 않고 로컬 파일명으로 치환

## 8. 기능별 요약

### 8.1 인증 게이트

`src/components/PasswordGateway.tsx`

- 비밀번호는 `import.meta.env.VITE_GATEWAY_PASSWORD` 또는 기본값 `0228`
- 성공 시 `gita_authenticated=true`

보안 관점:

- 완전한 보안 기능이 아니라 프런트엔드 가드에 가깝다.
- 소스 번들 안에서 우회 가능한 구조다.

### 8.2 개인 메모

`src/components/Reflections.tsx`

- 키 형식: `gita-note-<chapter>-<verse>`
- 현재 verse 메모 저장
- 현재 verse / 전체 verse 메모를 txt로 export 가능

### 8.3 메모 모달

`src/components/ReflectionsModal.tsx`

- `localStorage`의 모든 메모를 읽어 목록 표시
- 각 메모에 대응하는 산스크리트 일부를 `gita.json`에서 찾아 함께 보여줌

## 9. 대문 페이지 스크롤 이슈 분석

### 9.1 사용자 증상

사용자 설명: "대문 페이지 들어가면 위쪽으로 안 넘어가진다."

이 설명과 현재 구조를 함께 보면, 홈 화면 상단이 잘려 있거나 스크롤을 올려도 진짜 맨 위까지 도달하지 못하는 현상으로 해석하는 것이 가장 자연스럽다.

### 9.2 실제 원인

핵심 원인은 `AppShell`의 `main`에 들어간 `justify-center`다.

문제 코드:

- `src/components/ui/AppShell.tsx`
  - `main`이 `flex flex-col justify-center min-h-full overflow-y-auto`

홈 페이지는 `ChapterList` 하나만 `main` 안에 들어간다. 그런데 `ChapterList`는 히어로 섹션 + 셀렉트 박스 + 카드 그리드까지 있어서 화면보다 세로 길이가 길어진다.

이때 스크롤 컨테이너 안에서 `justify-center`가 걸리면 콘텐츠가 세로 중앙 정렬 기준으로 배치된다. 콘텐츠 높이가 뷰포트보다 커지면, 위쪽 일부가 스크롤 시작점보다 바깥으로 밀려난다. 그런데 바깥 부모가 `overflow-hidden`이라 그 위쪽 영역은 접근할 수 없다.

결과:

- 콘텐츠가 중앙 기준으로 배치됨
- 위쪽 일부가 잘림
- 사용자가 스크롤을 올려도 진짜 시작점까지 못 감

즉, 이 이슈는 데이터 문제가 아니라 레이아웃 정렬 방식 때문에 생긴다.

### 9.3 왜 홈에서 더 잘 드러나는가

구절 페이지도 내부적으로 중앙 정렬 성향이 있지만, 홈은 카드 그리드 때문에 콘텐츠 높이가 더 빨리 커진다. 그래서 같은 `justify-center`라도 홈에서 "맨 위 접근 불가"가 더 눈에 띄게 드러난다.

### 9.4 관련 2차 문제

`VerseView`의 아래 코드는 현재 구조와 맞지 않는다.

- `src/pages/VerseView.tsx`
  - `window.scrollTo(0, 0)`

실제 스크롤 컨테이너가 `window`가 아니라 `main`이므로, 페이지 이동 시 스크롤 초기화가 완전히 의도대로 동작하지 않을 가능성이 높다. 홈 스크롤 이슈와 같은 설계 결정에서 파생된 2차 증상이다.

## 10. 추가로 발견한 중요 리스크

### 10.1 index.html 엔트리 경로 불일치

`index.html`은 아래 파일을 불러오도록 되어 있다.

- `/src/main.jsx`

그런데 실제 파일은:

- `src/main.tsx`

즉, 현재 저장소 기준으로는 엔트리 경로가 맞지 않는다. 이 상태라면 로컬 개발이나 빌드에서 바로 실패할 가능성이 매우 높다.

이건 스크롤 이슈와 별개로, 가장 먼저 정리해야 하는 실행 리스크다.

### 10.2 GitHub Pages 배포 경로 리스크

`vite.config.js`는 `base: '/'`로 고정되어 있고, 데이터/자산 fetch도 절대 경로를 사용한다.

- `/gita.json`
- `/lexicon.json`
- `/mp3/...`
- `/favicon.png`

이 저장소는 `.github/workflows/deploy.yml`로 `gh-pages` 브랜치에 배포하도록 되어 있다. 만약 GitHub Pages의 일반적인 project page 형태로 배포된다면 URL은 보통 `/<repo-name>/` 하위가 된다. 그 경우 `base: '/'`와 절대 경로 fetch는 깨질 가능성이 높다.

즉, 커스텀 도메인이나 user page가 아닌 일반 repo page라면 배포 환경에서 자산 경로 문제가 날 수 있다.

이 항목은 코드상 강한 리스크이며, 실제 배포 URL 정책을 확인할 필요가 있다.

### 10.3 인코딩 깨짐 흔적이 광범위함

여러 파일에서 한글, 산스크리트, 특수문자가 심하게 깨진 흔적이 보인다.

대표 위치:

- `src/constants.ts`
- `src/pages/VerseView.tsx`
- `src/components/CompendiumModal.tsx`
- `public/gita.json`
- `public/lexicon.json`
- 기존 `research.md`, `plan.md`

영향:

- UI 라벨 일부가 깨질 수 있음
- 번역/주석 품질 저하
- 정규식/문자열 처리 오류 가능
- 유지보수 난이도 증가

즉, 이 프로젝트는 단순 UI 이슈 외에 문자 인코딩 복구 작업이 상당히 중요하다.

### 10.4 인증은 실질적 보안 장치가 아님

비밀번호가 클라이언트 코드에 있고, 인증 상태도 `localStorage`에만 저장된다. 따라서 이 게이트는 콘텐츠 가리기 수준이지 보호된 서비스 수준의 인증이 아니다.

### 10.5 빌드 검증 미완료 상태

현재 워크스페이스에 `node_modules`가 없다. 따라서 이번 분석에서는 실제 `npm run build`를 돌려서 타입 오류나 번들 오류까지 확인하지는 못했다.

다만 소스만 봐도 `index.html` 엔트리 경로 문제는 확실한 실행 리스크다.

## 11. 파일별 역할 요약

### 핵심 앱

- `src/main.tsx`: 앱 진입, Provider 연결
- `src/App.tsx`: 인증 분기, 라우팅, 메인 레이아웃 연결

### 페이지

- `src/pages/ChapterList.tsx`: 대문, 챕터 진입점
- `src/pages/VerseView.tsx`: 구절 리더

### 레이아웃/UI

- `src/components/ui/AppShell.tsx`: 전체 화면 셸, 스크롤 컨테이너
- `src/components/ui/ContentReader.tsx`: 구절 페이지용 본문 레이아웃
- `src/components/Sidebar.tsx`: 챕터/구절 내비게이션
- `src/components/Reflections.tsx`: 우측 메모 패널

### 데이터

- `src/utils/dataFetcher.ts`: `gita.json` 캐시 fetch
- `src/constants.ts`: 챕터 메타데이터
- `public/gita.json`: 본문/번역/단어/오디오 원본
- `public/lexicon.json`: 용어 사전

### 보조 기능

- `src/components/PasswordGateway.tsx`: 비밀번호 게이트
- `src/components/LexiconModal.tsx`: 사전 모달
- `src/components/CompendiumModal.tsx`: 설명 모달
- `src/components/ReflectionsModal.tsx`: 저장된 메모 전체 모달

## 12. 결론

이 프로젝트는 정적 데이터 기반의 독립형 경전 리더 앱으로 설계되어 있고, 전체 구조는 비교적 명확하다. 라우팅, 상태 관리, 모달, 오디오, 개인 메모까지 기능 축이 분리되어 있어 확장 가능성은 괜찮다.

하지만 현재 상태에서 가장 중요한 사실은 세 가지다.

1. 대문 페이지 상단 접근 불가 현상은 `AppShell`의 세로 중앙 정렬과 내부 스크롤 컨테이너 구조가 결합되며 생긴 레이아웃 문제다.
2. 실제 스크롤 컨테이너가 `window`가 아니라 `main`이어서, 스크롤 리셋 로직도 구조와 어긋나 있다.
3. 그 외에도 `index.html` 엔트리 경로 불일치, GitHub Pages 경로 리스크, 광범위한 인코딩 깨짐이 함께 존재한다.

즉, 현재 가장 먼저 손봐야 하는 우선순위는 다음 순서로 보는 것이 맞다.

1. 홈 스크롤 레이아웃 수정
2. 엔트리 파일 경로 정정
3. 배포 경로 정책 점검
4. 문자열 인코딩 복구

## 13. 이번 분석에서 직접 확인한 핵심 근거 파일

- `C:\Users\roadsea\Desktop\nagham\src\App.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\components\ui\AppShell.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\components\ui\ContentReader.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\pages\ChapterList.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\pages\VerseView.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\components\Sidebar.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\components\Reflections.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\components\PasswordGateway.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\context\ThemeContext.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\context\UIContext.tsx`
- `C:\Users\roadsea\Desktop\nagham\src\utils\dataFetcher.ts`
- `C:\Users\roadsea\Desktop\nagham\index.html`
- `C:\Users\roadsea\Desktop\nagham\vite.config.js`
- `C:\Users\roadsea\Desktop\nagham\.github\workflows\deploy.yml`
- `C:\Users\roadsea\Desktop\nagham\public\gita.json`
- `C:\Users\roadsea\Desktop\nagham\public\lexicon.json`
