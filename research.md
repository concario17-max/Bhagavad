# 배포 구조 및 Preview 실패 원인 분석 보고서

작성 기준일: 2026-03-16  
분석 대상 경로: `C:\Users\roadsea\Desktop\nagham`

## 1. 결론 요약

현재 이 저장소는 **배포 시스템이 두 개 겹쳐서 동작**하고 있다.

1. `main` 브랜치
   - 실제 소스 코드 브랜치
   - `package.json`, `src/`, `vite.config.js`가 존재
   - Cloudflare Pages가 이 브랜치를 직접 빌드하면 정상 동작 가능

2. `gh-pages` 브랜치
   - GitHub Actions가 `dist/` 결과물만 밀어 넣는 정적 산출물 브랜치
   - `package.json`이 없음
   - Cloudflare Pages가 이 브랜치를 소스 브랜치처럼 다시 빌드하려 하면 무조건 실패

따라서 현재 보이는 현상은 정상적으로 설명된다.

- `Production` 배포는 `main` 기준이라 성공
- `Preview` 배포는 `gh-pages` 기준이라 실패

즉, **Preview 오류의 핵심 원인은 코드 문제가 아니라 배포 구조 충돌**이다.

## 2. 왜 배포가 두 개로 나뉘어 보이는가

스크린샷 기준으로 배포가 아래처럼 나뉘어 있다.

- `Production` -> source: `main`
- `Preview` -> source: `gh-pages`

이건 보통 Cloudflare Pages에서 다음처럼 설정되어 있을 때 발생한다.

- Production branch: `main`
- Preview 대상: production 이외의 다른 브랜치들

그런데 이 저장소는 `.github/workflows/deploy.yml` 때문에 `main`에 push가 올 때마다 `gh-pages` 브랜치도 자동으로 갱신된다.

즉 실제 흐름은 이렇게 된다.

1. `main`에 커밋 push
2. Cloudflare Pages가 `main`을 보고 production 배포 시작
3. 동시에 GitHub Actions가 `main`을 checkout해서 `npm install`, `npm run build` 수행
4. GitHub Actions가 `dist/` 결과물을 `gh-pages` 브랜치에 push
5. Cloudflare Pages가 `gh-pages` 브랜치 push도 감지
6. 이 `gh-pages` 브랜치를 preview 배포로 처리
7. 그런데 `gh-pages`에는 `package.json`이 없어서 preview build 실패

그래서 사용자 입장에서는 항상 이런 그림이 만들어진다.

- production: 성공
- preview: 항상 실패

## 3. 실제 저장소 구조 확인 결과

### 3.1 `main` 브랜치

`main`에는 아래 파일이 있다.

- `package.json`
- `src/`
- `index.html`
- `vite.config.js`
- `.github/workflows/deploy.yml`

즉, 빌드 가능한 진짜 소스 브랜치다.

### 3.2 `gh-pages` 브랜치

`origin/gh-pages` 트리 확인 결과, 루트에는 아래만 있다.

- `assets/`
- `favicon.png`
- `gita.json`
- `gita_header_icon.png`
- `index.html`
- `lexicon.json`
- `mp3/`

없던 것:

- `package.json`
- `src/`
- `node_modules/`
- Vite 소스 설정 파일들

즉 `gh-pages`는 빌드 입력이 아니라 **빌드 결과만 있는 정적 배포 브랜치**다.

## 4. GitHub Actions가 실제로 하는 일

`.github/workflows/deploy.yml` 내용 요약:

- 트리거: `main` 브랜치 push
- 실행:
  - `actions/checkout@v4`
  - `npm install`
  - `npm run build`
  - `JamesIves/github-pages-deploy-action@v4`
- 배포 대상:
  - `folder: dist`
  - `branch: gh-pages`

즉 GitHub Actions는 `main`을 빌드해서 결과물만 `gh-pages`에 올린다.

이 구조는 원래 **GitHub Pages** 용으로 매우 전형적이다.

하지만 지금은 Cloudflare Pages도 같은 저장소를 보고 있기 때문에 문제가 생긴다.

## 5. Preview 로그 해석

사용자가 제공한 실패 로그 핵심:

- `2026-03-16T13:21:22.052055Z Cloning repository...`
- `HEAD is now at 26cc301 Deploying to gh-pages from @ concario17-max/Bhagavad@4c4aa375...`
- `Executing user command: npm run build`
- `npm error path /opt/buildhome/repo/package.json`
- `ENOENT: no such file or directory, open '/opt/buildhome/repo/package.json'`

이 로그는 아주 명확하다.

Cloudflare Pages가 한 일:

1. `gh-pages` 브랜치를 클론함
2. 그 브랜치를 일반 앱 소스 브랜치라고 가정함
3. 설정된 build command인 `npm run build`를 실행함
4. 루트에서 `package.json`을 찾으려 함
5. `gh-pages`에는 `package.json`이 없어서 실패함

즉 실패 원인은 아래 한 줄로 요약된다.

**Cloudflare가 산출물 브랜치(`gh-pages`)를 다시 소스처럼 빌드하려고 해서 실패했다.**

## 6. 왜 Production은 성공하는가

스크린샷에서 production은 `main`의 커밋 `4c4aa37` 기준으로 성공했다.

이건 당연하다.

`main`에는 다음이 있기 때문이다.

- `package.json`
- `src/`
- Vite 설정
- 빌드 스크립트

즉 Cloudflare가 `main`을 빌드하면 정상적으로 `npm run build`가 가능하다.

반대로 `gh-pages`에는 정적 파일밖에 없으므로 실패한다.

## 7. Preview가 항상 실패하는 구조적 이유

현재 구조에서는 `main`에 push가 갈 때마다 거의 항상 아래가 연쇄 발생한다.

1. `main` push
2. production build 시작
3. GitHub Actions가 `gh-pages` 갱신
4. `gh-pages` push
5. Cloudflare가 `gh-pages`를 preview로 처리
6. preview build 실패

그래서 preview 실패는 일회성 버그가 아니라 **설계상 반복될 수밖에 없는 상태**다.

즉 사용자가 말한 “프리뷰는 항상 오류가 난다”는 관찰은 정확하다.

## 8. 현재 배포 구조를 깊게 해석하면

이 저장소는 지금 사실상 두 가지 배포 모델을 동시에 쓰고 있다.

### 모델 A: GitHub Pages 방식

- `main`에서 빌드
- `gh-pages`에 정적 결과물 push
- 정적 호스팅은 `gh-pages`를 그대로 서빙

이건 `.github/workflows/deploy.yml`이 담당한다.

### 모델 B: Cloudflare Pages 방식

- 특정 브랜치를 직접 클론
- 그 브랜치를 빌드
- 결과물 생성 후 배포

이건 Cloudflare Pages가 담당한다.

문제는 이 두 모델이 **서로 전제가 다르다**는 점이다.

- GitHub Pages 모델의 `gh-pages`는 “이미 빌드된 산출물”
- Cloudflare Pages 모델의 브랜치는 “아직 빌드되지 않은 소스”

지금은 Cloudflare가 `gh-pages`를 후자로 오해하고 있다.

## 9. 지금 상태에서 어떤 배포가 진짜 기준인가

현재 기준에서 실제로 의미 있는 배포는 `main` 기반 production이다.

이유:

- 사용자가 확인한 production URL은 정상 배포됨
- 우리가 최근 수정한 코드도 `main` 기준으로 빌드 통과
- preview는 소스 검증용이 아니라 `gh-pages` 산출물 브랜치를 잘못 주워서 깨지는 상태

즉 지금 preview 실패는 “서비스 배포 실패”가 아니라 “잘못 구성된 보조 배포 실패”에 가깝다.

## 10. 왜 로그에 `Deploying to gh-pages from @ ...`가 보이는가

이 메시지는 GitHub Actions가 `gh-pages` 브랜치에 넣은 커밋 메시지다.

예:

- `Deploying to gh-pages from @ concario17-max/Bhagavad@4c4aa375...`

즉 preview 배포가 바라본 커밋은 개발자가 직접 만든 앱 소스 커밋이 아니라,
GitHub Action이 생성한 **배포용 결과물 커밋**이다.

이 점이 매우 중요하다.

Cloudflare preview는 실제 앱 소스를 보는 게 아니라, 이미 만들어진 배포 산출물 브랜치를 다시 빌드하려 하고 있다.

## 11. 지금 구조에서 발생할 수 있는 부작용

### 11.1 배포 상태가 혼란스러움

사용자 입장에서는:

- production은 초록색 성공
- preview는 빨간색 실패

이렇게 섞여 보여서 “최근 변경이 문제인가?”로 오해하기 쉽다.

하지만 실제 원인은 최근 코드가 아니라 브랜치 역할 충돌이다.

### 11.2 불필요한 빌드 비용

`main`이 한 번 push될 때:

- Cloudflare production build
- GitHub Actions build
- Cloudflare preview build 실패

최소 2~3개의 시스템이 동시에 반응한다.

즉 빌드 시간이 낭비되고 로그도 지저분해진다.

### 11.3 디버깅 방향이 왜곡됨

실제 오류는 `package.json` 부재인데, 표면상으로는 “preview deploy failed”로 보인다.

그래서 앱 코드나 Vite 설정을 의심하게 되지만, 본질은 브랜치/배포 모델 충돌이다.

## 12. 해결 방향

구조적으로는 아래 셋 중 하나를 택해야 한다.

### 방향 1. Cloudflare Pages만 사용

가장 깔끔한 방향이다.

- Cloudflare production branch를 `main`으로 유지
- GitHub Actions의 `gh-pages` 배포를 제거
- `gh-pages` 브랜치를 더 이상 쓰지 않음

장점:

- 배포 경로 단순
- preview/production이 같은 빌드 모델 사용
- 실패 원인 추적이 쉬움

### 방향 2. GitHub Pages만 사용

- Cloudflare Pages 연결을 끊거나 build를 안 하게 설정
- GitHub Actions가 `gh-pages`만 관리

장점:

- 현재 workflow와 가장 잘 맞음

단점:

- Cloudflare preview/production 기능은 포기

### 방향 3. Cloudflare는 `main`만 보게 하고 `gh-pages`는 무시

현실적인 절충안이다.

- Cloudflare production branch: `main`
- Cloudflare preview branch rules에서 `gh-pages` 제외
- GitHub Actions는 계속 유지 가능

장점:

- 현재 GitHub Actions 흐름을 크게 안 바꿔도 됨

단점:

- 시스템이 여전히 이중화되어 관리 복잡도는 남음

## 13. 추천

현재 상태에서는 **방향 1, 즉 Cloudflare Pages 단일화**가 가장 낫다.

이유:

- 이미 production이 `main` 기준으로 잘 동작 중
- 우리가 지금 맞춘 Vite base, hash routing, 정적 자산 경로도 Cloudflare 기준으로 정리됨
- `gh-pages` 브랜치는 지금 Cloudflare 입장에서는 혼란만 만든다

즉 가장 단순한 정리는 이렇다.

1. GitHub Actions의 `gh-pages` 배포 중지
2. Cloudflare Pages에서 `main`만 빌드
3. preview도 feature branch나 PR branch만 대상으로 사용
4. `gh-pages` 브랜치는 사용 중단 또는 삭제

## 14. “이렇게 나눠진 이유는 뭐지?”에 대한 직접 답변

짧게 말하면 이거다.

**`main`은 소스 브랜치이고, `gh-pages`는 GitHub Actions가 만든 결과물 브랜치인데, Cloudflare가 둘 다 배포 대상으로 보고 있어서 나뉘어 보인다.**

더 정확히 말하면:

- `production`은 `main`을 직접 빌드
- `preview`는 `gh-pages`를 잘못 소스 브랜치처럼 다시 빌드

그래서 둘이 분리되어 보이는 것이다.

## 15. “프리뷰는 왜 항상 오류가 나지?”에 대한 직접 답변

짧게 말하면 이거다.

**Cloudflare preview가 `gh-pages` 브랜치에서 `npm run build`를 실행하는데, 그 브랜치엔 `package.json`이 없어서 항상 실패한다.**

즉:

- preview 설정이 잘못된 것
- 앱 코드가 깨져서가 아님

## 16. 최종 판단

2026-03-16 기준으로 이 저장소의 preview 실패는 다음으로 판정된다.

- 원인: 배포 시스템 중복 + 브랜치 역할 충돌
- 재현성: 매우 높음, 구조상 반복됨
- 영향도: production 자체에는 직접 영향 없음
- 우선순위: 높음, 배포 신뢰도와 운영 가시성을 해침

## 17. 이번 분석에 사용한 핵심 근거

- `C:\Users\roadsea\Desktop\nagham\.github\workflows\deploy.yml`
- `C:\Users\roadsea\Desktop\nagham\package.json`
- `origin/gh-pages` 브랜치 루트 트리
- 사용자가 제공한 2026-03-16 13:21 UTC 배포 로그
- 사용자가 제공한 Cloudflare Pages 배포 화면 스크린샷
