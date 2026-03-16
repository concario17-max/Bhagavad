# Bhagavad 개선 우선순위 계획

작성일: 2026-03-16

## 현재 진행 상태

- [x] P0. 데이터 인코딩 정상화
- [x] P1. 구절 해석 로직 공통화
- [x] P2. 코멘터리 표시 위치 정리
- [x] P3. 메타데이터 출처 정리
- [x] P4. 로컬 스토리지 의존성 정리
- [ ] P5. 인증 구조 재평가

## P0. 데이터 인코딩 정상화

완료 항목:

- [x] `src/constants.ts` 문자열 복구
- [x] `public/gita.json` 텍스트 복구
- [x] `public/lexicon.json` 텍스트 복구
- [x] JSX 내부 깨진 기호 정리
- [x] 복구 후 샘플 확인 및 빌드 검증

## P1. 구절 해석 로직 공통화

완료 항목:

- [x] `src/utils/verse.ts` 추가
- [x] `resolveVerse()` 공용화
- [x] `getVerseRange()` 공용화
- [x] `VerseView.tsx` 공용 util 사용
- [x] `VerseCommentary.tsx` 공용 util 사용

## P2. 코멘터리 표시 위치 정리

완료 항목:

- [x] 본문 하단 코멘터리 제거
- [x] 우측 패널 코멘터리만 유지
- [x] notes/commentary 토글 의미와 실제 UI 일치

## P3. 메타데이터 출처 정리

완료 항목:

- [x] `src/utils/chapterMeta.ts` 추가
- [x] 홈 화면 챕터 카드가 공용 메타 resolver 사용
- [x] 사이드바 챕터 제목이 공용 메타 resolver 사용
- [x] 제목 분해 규칙(main/subtitle) 일원화

현재 기준:

- 챕터 제목과 설명은 공용 메타 레이어를 통해 읽는다.
- 실제 우선 메타 소스는 `CHAPTER_DATA`
- `gita.json`의 `name_translated`는 fallback으로만 사용

## P4. 로컬 스토리지 의존성 정리

완료 항목:

- [x] `src/utils/storage.ts` 추가
- [x] 인증 상태 저장을 공용 storage util로 이동
- [x] 테마 저장을 공용 storage util로 이동
- [x] UI 패널 상태 저장을 공용 storage util로 이동
- [x] word-by-word 토글 저장을 공용 storage util로 이동
- [x] 메모 읽기/쓰기/전체 목록 조회를 공용 storage util로 이동

정리 결과:

- 저장 키가 `STORAGE_KEYS`로 모였다.
- 메모 관련 반복 로직이 `getAllReflectionNotes()`로 통합되었다.
- 개별 컴포넌트가 `localStorage` 세부 구현을 직접 다루지 않게 되었다.

## P5. 인증 구조 재평가

완료 항목:

- [x] 인증 상태 읽기/쓰기를 `src/utils/auth.ts`로 정리
- [x] 게이트 비밀번호 조회를 공용 auth util로 정리
- [x] `PasswordGateway`에 클라이언트 게이트 한계 안내 문구 추가
- [x] `research.md`에 현재 인증 구조의 목적과 한계 반영

현재 결론:

- 현 구조는 유지
- 다만 보안 기능으로 간주하지 않음
- 실제 보호가 필요하면 서버 인증 또는 배포 접근 제한이 필요

## 남은 추천 실행 순서

1. 육안 QA 및 실제 브라우저 확인

## 검증 체크리스트

- [x] `npx tsc --noEmit`
- [x] `npm run build`
- [ ] 홈 화면 챕터 카드 육안 확인
- [ ] 대표 verse 3개 이상 육안 확인
- [ ] 우측 패널 notes/commentary 전환 확인
- [ ] 좌측 패널 열림/닫힘에 따른 폭 변화 확인
- [ ] 다크모드 토글 확인
