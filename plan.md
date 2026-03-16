# Bhagavad 작업 계획 TODO

## 완료 요약

- [x] 로컬 Node 런타임을 작업 폴더에 설치했다.
- [x] 의존성을 설치했다.
- [x] TypeScript 타입체크를 통과시켰다.
- [x] 프로덕션 빌드를 통과시켰다.
- [x] 홈 화면 상단 스크롤 문제를 해결했다.
- [x] 라우팅과 정적 자산 경로를 배포 친화적으로 정리했다.
- [x] `any`, `unknown` 없이 주요 화면과 모달 코드를 정리했다.
- [x] 깨진 JSX와 사용자 노출 라벨을 정리했다.

## 1. 실행 가능 상태 점검

- [x] `index.html` 엔트리 경로를 실제 파일 구조에 맞게 `src/main.tsx`로 수정
- [x] 로컬 Node 런타임 다운로드 경로 준비: `.tools/node-v22.14.0-win-x64`
- [x] `npm install` 실행
- [x] 타입체크 실행 환경 구성
- [x] `npx tsc --noEmit` 통과
- [x] `npm run build` 통과

## 2. 홈 화면 스크롤 문제 수정

- [x] `AppShell`에서 홈 화면 상단 접근을 막던 중앙 정렬 제거
- [x] 실제 스크롤 컨테이너를 `main#app-scroll-container`로 고정
- [x] 홈 화면에서 긴 콘텐츠가 위로 잘리지 않도록 레이아웃 수정
- [x] 홈과 구절 페이지가 같은 셸을 쓰되, 본문 정렬 책임은 페이지 쪽으로 분리

## 3. 스크롤 구조 정리

- [x] 내부 스크롤 컨테이너 기반 구조로 통일
- [x] `VerseView`의 `window.scrollTo`를 컨테이너 스크롤 초기화 방식으로 교체
- [x] 구절 이동 시 오디오 상태와 스크롤 상태를 함께 초기화
- [x] 모바일 패널 열림 시 기존 스크롤 잠금 동작 유지

## 4. 레이아웃 책임 재정리

- [x] `AppShell`은 화면 셸과 패널 배치만 담당하도록 정리
- [x] `ContentReader`는 구절 본문 정렬을 담당하도록 유지
- [x] 홈 화면은 상단에서 자연스럽게 시작되도록 수정
- [x] 구절 화면은 `ContentReader` 안에서 읽기 중심 레이아웃 유지

## 5. 홈 화면 UI 정리

- [x] `ChapterList`를 안전한 JSX로 재작성
- [x] 홈 화면 아이콘 경로를 `BASE_URL` 기반으로 수정
- [x] 챕터/구절 셀렉트 동작 유지
- [x] 홈 모달 트리거 버튼 정리
- [x] 홈 카드 그리드 렌더링 유지

## 6. 구절 페이지 정리

- [x] `VerseView`를 타입 안전한 코드로 재작성
- [x] 오디오 경로를 `BASE_URL` 기반으로 수정
- [x] 구절 범위 계산과 이전/다음 이동 유지
- [x] 단어 해설, 번역, commentary 영역을 정상 JSX로 정리
- [x] 구절 이동 시 스크롤 초기화 정상화

## 7. 데이터 로딩 구조 점검

- [x] `fetchGitaData()`를 공용 정적 데이터 로더로 유지
- [x] `/gita.json` 절대 경로 fetch를 `BASE_URL` 기반 fetch로 변경
- [x] `/lexicon.json` 절대 경로 fetch를 `BASE_URL` 기반 fetch로 변경
- [x] 이미지 및 mp3 경로를 공용 helper를 통해 생성하도록 정리

## 8. 타입 안정성 정리

- [x] 남아 있던 `any` 사용 제거
- [x] `unknown` 사용 없이 정적 타입 유지
- [x] `ReflectionsModal` 데이터 로딩을 타입 안전하게 재작성
- [x] `LexiconAlphabet` prop 타입 명시

## 9. 라우팅 및 배포 정책 정리

- [x] `BrowserRouter`를 `HashRouter`로 변경해 GitHub Pages 새로고침 리스크 축소
- [x] `vite.config.js`에서 production base를 `/Bhagavad/`로 설정
- [x] 정적 자산이 GitHub Pages repo 배포 경로 아래에서 동작하도록 정리

## 10. 주변 UI 및 모달 정리

- [x] `ThemeToggle` 깨진 속성 수정
- [x] `Header` 기본 제목과 버튼 라벨 정리
- [x] `Sidebar` 제목과 그룹 라벨 정리
- [x] `Reflections` 패널 텍스트와 export 흐름 정리
- [x] `CompendiumModal`을 안전한 콘텐츠로 재작성
- [x] `ReflectionsModal`을 안전한 콘텐츠로 재작성

## 11. 검증 결과

- [x] TypeScript: `npx tsc --noEmit` 통과
- [x] Production build: `npm run build` 통과
- [x] 홈 스크롤 구조 수정 후 번들 생성 확인
- [x] lazy-loaded 모달 청크 생성 확인

## 12. 후속 권장 작업

- [x] 현재 범위 구현 완료
- [x] 다음 후보 작업 식별
  - [x] 광범위한 데이터 인코딩 복구
  - [x] `alert` 기반 export 피드백을 인앱 UI로 교체
  - [x] 배포 후 실제 GitHub Pages URL에서 라우팅 동작 현장 확인
