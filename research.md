# Bhagavad 프로젝트 상세 연구 보고서

작성일: 2026-03-16  
분석 대상: `C:\Users\roadsea\Desktop\nagham`

## 1. 프로젝트 한줄 정의

이 프로젝트는 React + Vite + Tailwind CSS 기반의 바가바드 기타 열람 앱이다.  
사용자는 비밀번호 게이트를 통과한 뒤 챕터 목록에서 구절로 진입하고, 각 구절 화면에서 본문, 오디오, 단어별 풀이, 번역, 코멘터리, 개인 메모를 함께 읽도록 설계되어 있다.

## 2. 기술 스택과 실행 골격

확인된 핵심 스택:

- React 19 계열
- TypeScript
- Vite
- `react-router-dom`
- Tailwind CSS v4 스타일의 `@theme`
- `lucide-react`

실행 진입점은 [`src/main.tsx`](C:/Users/roadsea/Desktop/nagham/src/main.tsx)이다.

여기서 하는 일:

- 전역 CSS `src/index.css` 로드
- `ThemeProvider` 주입
- `UIProvider` 주입
- `App` 렌더링
- 전역 `window` 에러 리스너로 런타임 예외를 콘솔에 기록

즉 이 앱은 전역 상태를 Redux 같은 외부 도구 없이, 컨텍스트 2개로 관리한다.

## 3. 전역 컨텍스트 구조

### 3.1 테마 컨텍스트

[`src/context/ThemeContext.tsx`](C:/Users/roadsea/Desktop/nagham/src/context/ThemeContext.tsx)

역할:

- `theme: 'light' | 'dark'`
- `toggleTheme()`
- 초기값은 `localStorage.theme`
- 값이 바뀌면 `document.documentElement`에 `light` 또는 `dark` 클래스 부여

특징:

- 기본 테마는 `light`
- 운영체제 선호 테마를 자동 추종하지 않음
- 다크모드 여부는 페이지 새로고침 후에도 유지됨

### 3.2 UI 컨텍스트

[`src/context/UIContext.tsx`](C:/Users/roadsea/Desktop/nagham/src/context/UIContext.tsx)

역할:

- 좌측 챕터 사이드바 열림 상태
- 우측 패널 열림 상태
- 데스크톱에서 좌측 패널 고정 표시 여부
- 데스크톱에서 우측 패널 고정 표시 여부
- 우측 패널 모드: `notes | commentary`

저장되는 키:

- `gita-desktop-sidebar`
- `gita-desktop-reflections`
- `gita-active-verse-panel`

동작 특징:

- 모바일과 데스크톱을 `window.innerWidth < 1024` 기준으로 다르게 처리
- 모바일에서는 drawer처럼 열고 닫음
- 데스크톱에서는 폭 0 / 정상 폭 전환 방식으로 레이아웃 유지
- 우측 패널 토글은 `toggleReflections(forceOpen?: boolean)`로 구현

이 컨텍스트가 사실상 구절 화면의 모든 레이아웃 상호작용을 조율한다.

## 4. 라우팅 구조와 인증 흐름

[`src/App.tsx`](C:/Users/roadsea/Desktop/nagham/src/App.tsx)가 핵심이다.

### 4.1 라우터

- `HashRouter` 사용
- 라우트는 2개뿐임
  - `/`
  - `/chapter/:chapterNum/verse/:verseNum`

`HashRouter`를 선택한 이유는 정적 호스팅에서 새로고침 404를 피하려는 목적과 맞아 있다.  
Cloudflare Pages 루트 배포에서도 무난하고, 과거 GitHub Pages 대응 흔적과도 연결된다.

### 4.2 인증 게이트

라우팅보다 먼저 인증 상태를 확인한다.

인증 로직:

- `localStorage.gita_authenticated === 'true'`면 통과
- 아니면 [`src/components/PasswordGateway.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/PasswordGateway.tsx) 렌더

비밀번호 소스:

- 우선 `import.meta.env.VITE_GATEWAY_PASSWORD`
- 없으면 기본값 `0228`

의미:

- 서버 인증은 전혀 아님
- 프런트엔드 레벨의 간단한 접근 게이트
- 브라우저 저장소를 지우면 다시 게이트가 나타남

현재 코드에는 이 한계를 숨기지 않도록 안내 문구도 포함되어 있다.
즉 이 게이트는 계정 시스템이나 실제 보안 경계가 아니라, 단일 기기 기준의 진입 제어다.

## 5. 최상위 레이아웃과 스크롤 구조

### 5.1 AppShell

[`src/components/ui/AppShell.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/ui/AppShell.tsx)

이 파일이 현재 앱 UX의 중심이다.

구성:

- 전체 높이 `100dvh`
- 상단 헤더 선택적 렌더
- 좌측 패널 선택적 렌더
- 중앙 `main` 스크롤 컨테이너
- 우측 패널 선택적 렌더
- 홈 화면용 플로팅 다크모드 버튼

중요 포인트:

- `main` 요소에 `id="app-scroll-container"` 존재
- 실제 스크롤은 `window`가 아니라 이 내부 `main`에서 발생
- 모바일 패널이 열리면 `overflow-hidden touch-none`으로 본문 스크롤 차단

이 구조 때문에 구절 전환 시 `window.scrollTo()`가 아니라 내부 컨테이너 스크롤 제어가 필요하다.

### 5.2 스크롤 리셋 헬퍼

[`src/utils/paths.ts`](C:/Users/roadsea/Desktop/nagham/src/utils/paths.ts)의 `scrollAppContainerToTop()`

역할:

- `#app-scroll-container`가 있으면 그것을 맨 위로 이동
- 없으면 `window.scrollTo`

[`src/pages/VerseView.tsx`](C:/Users/roadsea/Desktop/nagham/src/pages/VerseView.tsx)에서 챕터/구절 변경 시 이 함수를 호출한다.

이전 홈 스크롤 문제를 해결하기 위해 중앙 정렬을 제거한 현재 구조와도 직접 연결된다.

## 6. 화면별 동작 분석

### 6.1 홈 화면: ChapterList

[`src/pages/ChapterList.tsx`](C:/Users/roadsea/Desktop/nagham/src/pages/ChapterList.tsx)

역할:

- 앱의 대문
- 챕터 선택과 진입 허브
- 컴펜디움, 렉시콘, 전체 메모 모달 진입점

상태:

- 챕터 목록
- 모달 3종 열림 상태
- 선택된 챕터
- 선택된 verse

데이터 흐름:

- 마운트 시 `fetchGitaData()` 호출
- `Object.values(data)`로 챕터 배열 구성

사용자 흐름:

1. 챕터 목록 fetch
2. 상단 셀렉트에서 chapter 선택
3. verse 선택
4. `/chapter/{chapter}/verse/{verse}` 이동

추가 진입 방식:

- 하단 카드 클릭 시 각 챕터 1절로 바로 이동

구조적 특징:

- 카드 메타는 `CHAPTER_DATA`에서 가져옴
- 실제 구절 수와 verse 데이터는 `gita.json`에서 가져옴
- 즉 메타와 본문 데이터 출처가 분리되어 있음

### 6.2 구절 화면: VerseView

[`src/pages/VerseView.tsx`](C:/Users/roadsea/Desktop/nagham/src/pages/VerseView.tsx)

역할:

- 특정 챕터/구절 본문 렌더
- 오디오 재생
- 단어별 의미 표시
- 번역 표시
- 본문 하단 내장 코멘터리 표시

핵심 상태:

- `verseData`
- `allChapters`
- `isPlaying`
- `currentTime`
- `duration`
- `showLexicon`

구절 결정 로직:

- URL의 `verseNum`과 완전히 동일한 verse가 없는 경우를 대비
- 현재 verse와 다음 verse 사이 범위 계산
- 예: 음원이나 데이터가 묶음 범위라면 실제 verse 시작점으로 재해석
- 필요하면 `navigate(..., { replace: true })`로 URL 보정

이 로직은 `VerseCommentary`에도 별도 복제되어 있다.

표시 섹션:

- breadcrumb
- 산스크리트 원문
- IAST
- 한국어 발음
- 오디오 플레이어
- word-by-word 토글
- 영어 및 한국어 번역 다중본
- 본문 하단 코멘터리

하단 이동:

- 이전 구절
- 다음 구절
- 챕터 경계 넘김 지원

### 6.3 헤더

[`src/components/Header.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/Header.tsx)

구절 화면에서만 나타난다.

구성:

- 좌측: 챕터 사이드바 토글 버튼
- 가운데: 홈 링크 + 타이틀
- 우측: 커스텀 `rightContent` + 다크모드 토글

현재 `rightContent`로 [`src/components/VersePanelToggle.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/VersePanelToggle.tsx)가 들어간다.

### 6.4 좌측 패널: Sidebar

[`src/components/Sidebar.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/Sidebar.tsx)

역할:

- 챕터 목록
- 펼쳐진 챕터의 verse 목록

동작:

- `fetchGitaData()`로 챕터/절 목록 로드
- 현재 URL chapter를 기준으로 해당 챕터 자동 펼침
- 챕터 버튼 클릭 시 그 챕터 1절로 이동
- 하단 verse 링크 클릭 시 해당 구절로 이동

메타:

- 제목은 `CHAPTER_DATA`를 우선 사용
- 부제는 괄호 기반 파싱

구성상 `SidebarLayout` + `SidebarMenu`의 조합이다.

## 7. 우측 패널 구조

### 7.1 패널 모드 전환 버튼

[`src/components/VersePanelToggle.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/VersePanelToggle.tsx)

역할:

- notes ↔ commentary 전환
- 전환 시 우측 패널을 강제로 열기

즉 단순한 모드 전환이 아니라, 사용자가 항상 결과를 보게 만드는 UX다.

### 7.2 우측 패널 컨테이너

[`src/components/VerseSidePanel.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/VerseSidePanel.tsx)

역할:

- notes 모드면 `Reflections`
- commentary 모드면 `VerseCommentary`

폭 전략:

- 모바일 commentary: `w-[94vw]`
- 모바일 notes: `w-[90vw]`
- 데스크톱 notes: `lg:w-[380px]`
- 데스크톱 commentary:
  - 좌측 챕터 패널 열림: `lg:w-[460px]`
  - 좌측 챕터 패널 닫힘: `lg:w-[760px]`

즉 사용자가 요청한 “좌측 챕터 창 닫으면 코멘트 창이 더 넓어짐” 요구는 현재 여기서 구현되어 있다.

### 7.3 메모 패널

[`src/components/Reflections.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/Reflections.tsx)

역할:

- 현재 구절 메모 작성
- `localStorage` 저장
- 현재 구절 메모 export
- 전체 메모 export

저장 키:

- `gita-note-{chapterNum}-{verseNum}`

특징:

- 저장은 명시적 버튼 클릭 기반
- 자동 저장 아님
- export는 브라우저 Blob 다운로드 방식

### 7.4 코멘터리 패널

[`src/components/VerseCommentary.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/VerseCommentary.tsx)

역할:

- 현재 구절의 `commentary_en`만 별도 패널로 표시

특징:

- `VerseView`와 유사한 resolve 로직을 자체 보유
- `$`로 시작하거나 데바나가리 범위가 포함된 commentary는 표시하지 않음
- 없는 경우 placeholder 출력

중요한 구조적 사실:

- 코멘터리는 본문 내부에도 있고, 우측 패널에도 다시 있다
- 즉 현재 앱은 코멘터리를 두 위치에서 보여주는 중복 구조다
- 앞으로 UX를 단순화하려면 한쪽을 기준으로 정리할 필요가 있다

### 7.5 전체 메모 모달

[`src/components/ReflectionsModal.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/ReflectionsModal.tsx)

역할:

- `localStorage`의 모든 `gita-note-*`를 읽음
- `gita.json`과 조합해 구절 정보와 함께 렌더

즉 메모는 저장 시에는 순수 로컬 데이터지만, 모달 렌더 시에는 본문 데이터와 조합된다.

## 8. 모달 및 보조 기능

### 8.1 CompendiumModal

[`src/components/CompendiumModal.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/CompendiumModal.tsx)

정적 안내 문서 성격의 모달이다.  
앱 사용 방법과 프로젝트 성격을 설명한다.

### 8.2 LexiconModal

[`src/components/LexiconModal.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/LexiconModal.tsx)

역할:

- `lexicon.json` 지연 로드
- 알파벳 인덱스 제공
- 섹션 스크롤 이동

특징:

- `isOpen`이고 아직 비어 있을 때만 fetch
- 데이터는 `Record<string, {word, meaning}[]>`

## 9. 공용 UI 컴포넌트 성격

### 9.1 ContentReader

[`src/components/ui/ContentReader.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/ui/ContentReader.tsx)

역할:

- header / body / footer 조합 레이아웃
- 구절 본문 전용 읽기 화면 컨테이너

구조적 한계:

- 파일 주석이 이미 심하게 깨져 있음
- `justify-center` 중심 레이아웃 성향이 남아 있어 길이가 짧은 콘텐츠와 긴 콘텐츠를 둘 다 다루는 데 제약이 생길 수 있음

### 9.2 SidebarLayout / SidebarMenu

[`src/components/ui/SidebarLayout.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/ui/SidebarLayout.tsx)  
[`src/components/ui/SidebarMenu.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/ui/SidebarMenu.tsx)

역할:

- 모바일/데스크톱 겸용 drawer 프레임
- 그룹 목록과 하위 항목 목록 분리 렌더

특징:

- 좌우 공용 구조
- 다만 실제 사용은 현재 좌측 챕터 패널에서만 명확함
- 일부 placeholder 텍스트와 주석이 깨져 있음

### 9.3 GlassCard

[`src/components/ui/GlassCard.tsx`](C:/Users/roadsea/Desktop/nagham/src/components/ui/GlassCard.tsx)

홈 챕터 카드용 공용 카드다.  
시각 스타일은 화이트/골드 기반 글래스모피즘.

## 10. 데이터 구조 분석

### 10.1 본문 데이터

파일: `public/gita.json`

형식:

- 최상위는 chapter 번호 문자열 키의 객체
- 각 chapter는:
  - `chapter`
  - `verses`
  - `name_translated?`

각 verse는 [`src/types/index.ts`](C:/Users/roadsea/Desktop/nagham/src/types/index.ts) 기준:

- `id`
- `chapter`
- `verse`
- `sanskrit`
- `iast`
- `korean_pronunciation?`
- `audio?`
- `words?`
- `translation_en?`
- `translation_ham?`
- `translation_gil?`
- `translation_jimong?`
- `translation_suk?`
- `commentary_en?`

실제 관찰 결과:

- 데이터 양이 매우 큼
- 일부 verse는 verse range처럼 묶이는 구조를 암시
- `audio`는 외부 URL 문자열이지만 앱은 파일명만 추출해 로컬 `mp3/` 경로로 재매핑

### 10.2 렉시콘 데이터

파일: `public/lexicon.json`

형식:

- 알파벳 키 기반 객체
- 각 키는 단어 배열
- 각 항목은 `word`, `meaning`

### 10.3 챕터 메타 데이터

파일: [`src/constants.ts`](C:/Users/roadsea/Desktop/nagham/src/constants.ts)

역할:

- 챕터 이름
- 한국어 이름
- 설명문

중요한 문제:

- 이 파일의 문자열이 다수 깨져 있다
- 일부 이름과 설명은 정상 의미를 추정 가능하지만 원문 무결성이 깨짐

즉 현재 프로젝트는 `public/gita.json`, `public/lexicon.json`, `src/constants.ts` 전반에 인코딩 손상 흔적이 존재한다.

## 11. 정적 자산 경로와 fetch 전략

### 11.1 base path 유틸

[`src/utils/paths.ts`](C:/Users/roadsea/Desktop/nagham/src/utils/paths.ts)

역할:

- `import.meta.env.BASE_URL` 정규화
- `withBasePath(path)` 제공

사용처:

- `gita.json`
- `lexicon.json`
- `gita_header_icon.png`
- `mp3/*`

의미:

- 정적 자산 참조를 하드코딩 slash root에서 분리
- Cloudflare 루트 배포와 Vite base 환경 모두 대응 가능

### 11.2 데이터 fetch 캐시

[`src/utils/dataFetcher.ts`](C:/Users/roadsea/Desktop/nagham/src/utils/dataFetcher.ts)

특징:

- `gitaDataPromise` 단일 promise 캐시
- 처음 한 번만 fetch
- 실패하면 캐시 초기화

이 설계 덕분에 여러 컴포넌트가 동시에 `fetchGitaData()`를 호출해도 브라우저에서는 한 번만 네트워크 요청이 발생한다.

## 12. 스타일 시스템

[`src/index.css`](C:/Users/roadsea/Desktop/nagham/src/index.css)

구조:

- `@import "tailwindcss"`
- `@theme`에 색상/폰트 토큰 정의
- `dark` variant 정의
- body 기본 배경/글꼴
- 커스텀 스크롤바

시각 방향:

- 라이트 모드: 크림/베이지/골드
- 다크 모드: 검정/짙은 회색 + 골드 포인트
- 폰트는 serif 중심 독서형 톤

디자인 성격:

- 앱이라기보다 전자책/아카이브/성전 열람기 느낌
- 과한 인터랙션보다 읽기 흐름 중심

## 13. 배포 및 빌드 구조

### 13.1 현재 로컬 설정

[`vite.config.js`](C:/Users/roadsea/Desktop/nagham/vite.config.js)

현재 base:

- `/`

의미:

- Cloudflare Pages 루트 배포 기준

### 13.2 GitHub Actions

[` .github/workflows/deploy.yml `](C:/Users/roadsea/Desktop/nagham/.github/workflows/deploy.yml)

현재 이름은 `Build Check`이며, 실제 배포가 아니라 CI 검증 워크플로우다.

동작:

- `main` push 또는 PR
- `npm ci`
- `npx tsc --noEmit`
- `npm run build`

즉 과거 `gh-pages` 배포 워크플로우는 제거되고, 현재는 Cloudflare Pages를 전제로 한 빌드 검증만 남아 있다.

### 13.3 정리된 배포 모델

현재 코드 기준 권장 해석:

- 소스 오브 트루스: `main`
- 실제 배포: Cloudflare Pages가 `main`을 빌드
- GitHub Actions: 단순 검증

이 구조는 이전 `gh-pages` 브랜치 중복 배포 문제를 없애는 방향으로 이미 정리되어 있다.

## 14. 확인된 구조적 리스크와 결함

### 14.1 인코딩 손상

가장 큰 문제다.

손상 징후가 뚜렷한 위치:

- `src/constants.ts`
- `public/gita.json`
- `public/lexicon.json`
- 일부 컴포넌트 JSX 내부 문자
- 일부 주석

영향:

- 제목/설명/산스크리트/한국어 표기가 깨짐
- 일부 UI 구분 문자도 깨져 보임
- 데이터 품질이 UX를 심각하게 저해

이 문제는 타입체크나 빌드로는 잡히지 않는다.  
실제 내용 품질 문제이므로 별도 정제 작업이 필요하다.

### 14.2 코멘터리 중복 렌더링

코멘터리가 두 군데 나온다.

- 본문 하단
- 우측 `VerseCommentary` 패널

결과:

- 정보 중복
- 패널 추가의 이유가 흐려짐
- 향후 UX 정리 필요

### 14.3 resolve 로직 중복

구절 범위 해석 로직이 다음 두 파일에 중복된다.

- `VerseView.tsx`
- `VerseCommentary.tsx`

리스크:

- 향후 한쪽만 수정되면 구절 판정 불일치 가능
- 공통 util 추출 여지가 큼

### 14.4 클라이언트 전용 접근 제어

비밀번호 게이트는 편의 수준이다.

한계:

- 보안 기능이 아님
- 번들 또는 localStorage를 이해하는 사용자는 우회 가능

### 14.5 로컬 스토리지 의존성

다음 기능들이 모두 `localStorage`에 의존한다.

- 인증
- 테마
- 좌우 패널 상태
- 패널 모드
- 메모
- word-by-word 펼침 여부

즉 SSR 전환이나 멀티디바이스 동기화, 서버 계정 시스템과는 거리가 멀다.

## 15. 실제 사용자 여정

현재 구조를 사용자 기준으로 풀면 다음과 같다.

1. 앱 접속
2. `gita_authenticated`가 없으면 비밀번호 입력
3. 홈 화면에서 챕터 목록 또는 셀렉터 사용
4. 구절 화면 진입
5. 좌측에서 챕터/구절 탐색
6. 가운데에서 본문, 음원, 번역, 단어풀이 읽기
7. 우측에서 메모 또는 코멘터리 보기
8. 필요 시 메모 export
9. 홈에서 렉시콘, 컴펜디움, 전체 메모 모달 열기

즉 이 앱의 본질은 “검색형 서비스”가 아니라 “독서형 리더”다.

## 16. 현재 구조에 대한 종합 평가

강점:

- 전역 구조가 단순하고 읽기 쉬움
- 데이터가 정적 파일이라 배포가 단순함
- 챕터/구절/메모/코멘터리 흐름이 명확함
- UI 상태가 컨텍스트 하나로 잘 모여 있음
- 타입 구조가 비교적 단정함

약점:

- 인코딩 깨짐이 앱 품질을 크게 떨어뜨림
- 구절 해석 로직 중복
- 코멘터리 노출 위치 중복
- 접근 제어가 실제 보안이 아님
- 로컬 스토리지에 너무 많은 역할이 몰려 있음

## 17. 우선순위 높은 후속 개선 제안

1. 인코딩 정상화
2. `resolveVerse` 공통 유틸 추출
3. 코멘터리 노출 위치 단일화 결정
4. `CHAPTER_DATA`와 `gita.json` 메타 중복 정리
5. 필요하면 인증을 서버 기반으로 전환

## 18. 결론

이 프로젝트는 현재 “정적 데이터 기반 바가바드 기타 독서 앱”으로 명확하게 동작하고 있다.  
핵심 UX는 홈에서 챕터를 고르고, 구절 화면에서 좌측 탐색, 중앙 본문, 우측 메모/코멘터리를 함께 보는 구조다.  
코드 구조 자체는 비교적 단순하고 유지보수 가능한 편이지만, 데이터 인코딩 손상과 일부 중복 설계가 전체 완성도를 크게 깎고 있다.

즉 지금 이 프로젝트의 핵심 문제는 아키텍처 붕괴가 아니라, 데이터 품질과 세부 UX 정리 단계에 들어와 있다는 점이다.
