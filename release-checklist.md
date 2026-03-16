# Bhagavad Release Checklist

작성일: 2026-03-16

대상 배포 URL:

- `https://bhagavad-9yk.pages.dev`

## 빌드 상태

- [x] `tsc --noEmit` 통과
- [x] `npm run build` 통과

## 프로덕션 QA

- [x] 게이트 비밀번호(`0228`)로 정상 진입
- [x] 홈 화면 제목 `BHAGAVAD GITA` 확인
- [x] 홈 화면 챕터 카드 18개 확인
- [x] 홈에서 챕터 카드 클릭 후 구절 페이지 정상 진입
- [x] 구절 화면 `Home` breadcrumb 확인
- [x] 구절 화면 `Word-by-word` 섹션 확인
- [x] 구절 화면 `Translation` 섹션 확인
- [x] 우측 패널 `Notes / Commentary` 전환 확인
- [x] 좌측 챕터 패널 닫힘 시 코멘터리 패널 폭 확장 확인
- [x] 다크모드 토글 확인
- [x] 인증된 상태에서 해시 URL 직접 진입(`/#/chapter/1/verse/1`) 확인

## 모바일 / 접근성

- [x] 모바일 좌측 챕터 패널 열림 확인
- [x] 모바일 우측 패널 열림 확인
- [x] 모바일 `Close Chapters` 버튼 확인
- [x] 모바일 `Close verse panel` 버튼 확인

## 운영 메모

- 현재 배포 구조는 Cloudflare Pages 기준 단일 배포다.
- GitHub Actions는 배포가 아니라 타입체크와 빌드 검증용이다.
- 인증 게이트는 실제 보안 인증이 아니라 브라우저 로컬 진입 제어다.
- 자동화 점검에서는 “게이트 통과 후 내부 클릭 이동”과 “인증된 직접 해시 진입” 모두 정상 동작을 확인했다.

## 남은 수동 QA 권장 항목

- 폰트 렌더링과 행간, 여백의 미세한 시각 품질 확인
- 긴 코멘터리/긴 번역문에서의 실제 읽기 감각 확인
- 모바일 실기기에서 손가락 동선 기준 닫기/스크롤 감각 확인
