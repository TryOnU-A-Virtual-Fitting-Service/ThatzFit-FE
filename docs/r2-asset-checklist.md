# R2 Asset Checklist

코드 기준으로 프런트엔드가 기대하는 R2/CDN 오브젝트 키 정리입니다.

## Request Flow

Request -> loader/injector -> plugin bundle load -> backend asset lookup / image upload -> frontend `<img>` render

## Responsibility Boundary

- Frontend: CDN 번들 로드, 기본/회사별 이미지 URL 렌더링, 모델/의류 업로드 요청 전송
- Backend: 기본 asset URL 제공, 회사별 asset URL 조회, 업로드 이미지의 R2 public URL 생성
- Infrastructure: `plugin/`, `default/`, `users/` 경로를 R2와 CDN 커스텀 도메인으로 공개

## Required Exact Keys

- `plugin/ThatzfitService.js`
- `plugin/ThatzfitSDKInjector.js`
- `plugin/<ThatzFit-FE dist/asset-manifest.json 에 기록된 JS/CSS/asset 파일들>`
- `default/assets/thatzfit_logo.svg`
- `default/assets/thatzfit_slogan.svg`
- `default/assets/thatzfit_btn.svg`
- `default/assets/animation/hanger.svg`
- `default/assets/animation/button.svg`
- `default/assets/animation/ruler.svg`
- `default/assets/animation/thread.svg`
- `default/assets/animation/clothes.svg`
- `default/models/slim-korean-male.png`
- `default/models/slim-korean-female.png`

## Runtime Prefixes

- `users/models/`
- `users/clothes/`
- `users/tryonresults/`

오브젝트 스토리지는 폴더 자체가 없어도 동작하므로, 위 경로는 "존재해야 하는 디렉터리"가 아니라 런타임 업로드 key prefix입니다.

## Optional But Operationally Recommended

- 활성 회사의 `logoUrl`
- 활성 회사의 `sloganUrl`
- 활성 회사의 `btnUrl`

가능하면 모두 같은 R2/CDN 도메인으로 맞추는 편이 점검과 운영이 단순합니다.

## Verification

### 가장 일반적인 점검 절차

`check_r2_assets.py`는 백엔드 저장소에 있습니다. 백엔드 `.env`의 R2 설정을 사용해서 실제 R2 버킷을 읽고, 프런트엔드 빌드 결과와 코드가 기대하는 고정 asset key가 있는지 비교합니다.

Request -> FE build manifest 생성 -> Backend script가 R2 list 조회 -> 누락 key 출력 -> exit code 반환

- Frontend responsibility: `dist/asset-manifest.json` 생성, `assets/r2/default/...` 원본 asset 관리
- Backend responsibility: `.env`의 R2 credentials와 DB의 회사 asset URL 기준으로 누락 여부 계산
- Infrastructure responsibility: R2 bucket, CDN custom domain, GitHub Actions secrets 제공

먼저 FE manifest를 생성합니다.

```bash
cd /Users/givemethatsewon/git/thatzfit/ThatzFit-FE
pnpm run build
```

그 다음 백엔드 저장소에서 점검 스크립트를 실행합니다.

```bash
cd /Users/givemethatsewon/git/thatzfit/ThatzFit-BE-fastapi
uv run python scripts/check_r2_assets.py
```

활성 회사별 logo/slogan/button URL까지 DB 기준으로 확인합니다. DB 연결 또는 seed data가 준비되지 않은 환경에서는 아래처럼 회사 asset 조회를 생략할 수 있습니다.

```bash
uv run python scripts/check_r2_assets.py --skip-company-assets
```

CI나 자동화에서 파싱하기 쉽게 JSON으로 출력하려면:

```bash
uv run python scripts/check_r2_assets.py --json
```

ThatzFit-FE 빌드 산출물 manifest를 다른 경로에서 읽으려면:

```bash
uv run python scripts/check_r2_assets.py --manifest-path /absolute/path/to/asset-manifest.json
```

### 결과 해석

- `Missing required exact keys: 0`: 플러그인 실행에 필요한 필수 고정 asset과 manifest 기반 FE 번들이 모두 R2에 있음
- `Missing company asset keys: 0`: 활성 회사의 logo/slogan/button asset이 모두 R2에 있음
- `Runtime prefix object counts`: `users/models/`, `users/clothes/`, `users/tryonresults/` 아래 런타임 업로드 결과 개수. 0이어도 폴더가 없다는 뜻일 뿐, 필수 고정 asset 누락과는 별개입니다.
- 스크립트는 필수 누락이 있으면 exit code `1`, 누락이 없으면 `0`으로 종료합니다.

### 필요한 환경 변수

백엔드 `.env`에 아래 값이 있어야 합니다.

```env
STORAGE_PROVIDER=r2
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_ENDPOINT_URL=...
R2_BUCKET_NAME=...
CDN_BASE_URL=...
```

비밀값은 GitHub에 커밋하지 않습니다. GitHub Actions에서는 repo 또는 org secret으로 주입합니다.

## GitHub Actions Deployment

현재 자동 배포 entrypoint는 `ThatzFit-FE` 저장소의 `.github/workflows/deploy-r2-assets.yml`입니다.

Trigger:

- `main` push
- `codex/r2-asset-automation` push
- manual `workflow_dispatch`

현재 동작:

1. `ThatzFit-FE`를 빌드해서 `dist/asset-manifest.json`과 hashed JS/CSS 파일 생성
2. `thatzfit-sdk-injector`를 checkout하고 방금 만든 FE manifest 기준으로 `ThatzfitSDKInjector.js` 빌드
3. `Thatzfit-loader`를 checkout하고 `ThatzfitService.js` 빌드
4. R2 `plugin/` prefix에 FE bundle, manifest, injector, loader 업로드
5. `assets/r2/` 아래 기본 asset을 R2 root prefix에 업로드

업로드 정책:

- `aws s3 sync dist s3://<bucket>/plugin --delete`는 FE `dist` 기준으로 바뀐 파일과 누락 파일만 전송하고, 더 이상 manifest에 없는 오래된 hashed bundle은 삭제합니다.
- `ThatzfitService.js`, `ThatzfitSDKInjector.js`, `asset-manifest.json`은 안정 URL 파일이라 `sync --delete` 대상에서 제외하고 별도 `aws s3 cp`로 덮어씁니다.
- "없는 파일만 업로드" 방식만 쓰면 안정 URL 파일이 갱신되지 않거나 오래된 hashed bundle이 계속 쌓일 수 있습니다. FE bundle은 `sync --delete`, 안정 URL 파일은 명시적 overwrite가 현재 권장 방식입니다.

필요한 GitHub secrets:

- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_ENDPOINT_URL`
- `R2_BUCKET_NAME`
- `CDN_BASE_URL`
- `CI_REPO_TOKEN` private cross-repo checkout이 필요한 경우

`VITE_CDN_HOST`는 GitHub Actions variable로 둘 수 있습니다. 없으면 `CDN_BASE_URL` secret을 사용합니다.

## Repository Roles

### `ThatzFit-FE`

React plugin app입니다. iframe 안에서 실제 가상 피팅 UI를 렌더링합니다.

주요 책임:

- 회사 branding asset 조회 및 렌더링
- 사용자 초기화와 fitting/model/history API 호출
- capture flow와 loading animation 렌더링
- R2 배포 entrypoint workflow 보유
- `assets/r2/default/...` 기본 public asset 원본 관리

### `Thatzfit-loader`

고객사 페이지가 직접 로드하는 안정 URL 스크립트입니다.

주요 책임:

- `window.Thatzfit` command queue 생성
- 고객사 페이지에 SDK 초기 진입점을 제공
- `https://.../plugin/ThatzfitSDKInjector.js`를 동적으로 로드

고객사는 보통 이 stable URL만 유지하면 됩니다.

### `thatzfit-sdk-injector`

loader 다음 단계에서 실행되는 iframe injector입니다.

주요 책임:

- `#thatzfit-plugin`, `#thatzfit-entry`, `#thatzfit-iframe-wrapper`, `#thatzfit-iframe` 생성
- FE `asset-manifest.json` 기준으로 최신 hashed JS/CSS 파일명을 읽음
- iframe 문서에 FE bundle과 CSS를 주입

FE 빌드 파일명은 hash가 붙어 매번 바뀔 수 있으므로, injector가 manifest 기반으로 최신 파일명을 알아야 합니다.

### `ThatzFit-BE-fastapi`

FastAPI backend입니다.

주요 책임:

- 사용자, 회사 setup, fitting, default model API 제공
- R2 업로드 URL 생성과 runtime image 저장
- R2 asset 누락 점검 스크립트 제공

### 왜 모두 필요한가

고객사 입장에서는 stable script URL 하나만 유지해야 합니다. 반면 실제 FE bundle은 캐시 효율과 배포 안정성을 위해 hashed filename으로 배포됩니다.

이 간극을 아래 계층이 나눠 해결합니다.

```text
Customer site
  -> ThatzfitService.js        안정 URL, 고객사가 로드
  -> ThatzfitSDKInjector.js    안정 URL, iframe과 manifest 기반 bundle 주입
  -> index.<hash>.js/css       FE app, 캐시 가능한 실제 플러그인 bundle
  -> FastAPI backend           API/R2 runtime upload 처리
```

이 구조 덕분에 고객사는 새 빌드마다 script URL이나 설정을 바꾸지 않고, R2/CDN에 올라간 최신 stable loader/injector와 manifest 기반 FE bundle을 사용합니다.

## Deployment Design Opinion

FE push가 `thatzfit-sdk-injector`와 `Thatzfit-loader` workflow를 별도로 trigger하는 방식도 가능합니다. 다만 현재 기준에서는 `ThatzFit-FE` workflow 하나가 세 repo를 checkout해서 한 번에 빌드/업로드하는 방식이 더 단순합니다.

현재 방식의 장점:

- 한 workflow run에서 FE manifest, injector, loader가 같은 배포 단위로 맞춰짐
- R2 업로드 순서와 검증을 한 곳에서 관리
- 외부 workflow 완료 대기, 실패 전파, 중복 업로드 조정이 필요 없음

trigger 방식이 더 나은 경우:

- 각 repo의 배포 권한과 ownership을 완전히 분리해야 할 때
- injector/loader가 FE 외에도 독립 release lifecycle을 가져야 할 때
- GitHub Actions reusable workflow 또는 repository dispatch 상태 추적을 제대로 설계할 시간이 있을 때

현재 인수인계/운영 단순성을 우선하면 `ThatzFit-FE`가 전체 plugin asset deployment를 orchestrate하는 현재 방식이 더 적합합니다. 단, private cross-repo checkout을 위해 `CI_REPO_TOKEN` 권한 관리는 명확히 해야 합니다.
