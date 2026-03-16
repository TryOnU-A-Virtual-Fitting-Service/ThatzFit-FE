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

백엔드 `.env` 기준 R2 버킷과 비교하려면:

```bash
cd /Users/givemethatsewon/git/thatzfit/ThatzFit-BE-fastapi
uv run python scripts/check_r2_assets.py
```

ThatzFit-FE 빌드 산출물 manifest를 다른 경로에서 읽으려면:

```bash
uv run python scripts/check_r2_assets.py --manifest-path /absolute/path/to/asset-manifest.json
```
