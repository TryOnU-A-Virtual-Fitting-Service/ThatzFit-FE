# ThatzFit Virtual Fitting Plugin (FE)

ThatzFit 가상 피팅 플러그인의 프론트엔드 프로젝트입니다.  
일반 SPA처럼 메인 DOM에 직접 마운트하지 않고, `iframe` + `shadow DOM` 기반으로 호스트 페이지에 임베드됩니다.

## Tech Stack

- `React 19`
- `React Router`
- `Tailwind CSS`
- `shadcn/ui`
- `TanStack Query`
- `Zustand`
- `ky`
- `TypeScript`
- `Vite`

## Docs

- 상세 아키텍처, 임베드 구조, FSD 설명, 흐름도:
  - `docs/project-architecture.md`

## 실행

```bash
pnpm install
pnpm dev
```

추가 스크립트

- `pnpm build`
- `pnpm lint`
- `pnpm ts:check`
