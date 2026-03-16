# Capture Stabilization Phase 1

## Goal

- Stabilize the `html2canvas` capture path on Chrome desktop.
- Target: capture-area accuracy >= 95% across the defined scenarios.
- Pivot rule: if accuracy is below 95%, move to phase 2 (`getDisplayMedia`).

## Scope

- In: coordinate calculation, crop pipeline, async timing stability, cleanup consistency.
- Out: extension APIs, mobile/Safari expansion, backend contract changes.

## Capture Engine Contract

- `CaptureRect`:
  - `left`: viewport x (CSS pixels)
  - `top`: viewport y (CSS pixels)
  - `width`: viewport width (CSS pixels)
  - `height`: viewport height (CSS pixels)
- `CaptureEngine.capture(rect): Promise<Blob>`

Phase 1 engine:

- `Html2CanvasCaptureEngine`

Phase 2 stub:

- `DisplayMediaCaptureEngine` (not implemented in this phase)

## Playwright Validation Scenarios (Chrome Desktop)

> The plugin currently depends on app runtime state and API auth, so run these after backend and frontend are ready.

1. Scenario A (No scroll, center drag)

- Open host page.
- Open plugin.
- Click "입어보기".
- Drag a rectangle in the center area and release.
- Verify captured preview image matches selected area.

2. Scenario B (After vertical scroll)

- Scroll down.
- Click "입어보기".
- Drag selection around product area.
- Verify captured preview matches selected area.

3. Scenario C (Edge drag)

- Click "입어보기".
- Drag near top-right edge.
- Repeat near bottom-left edge.
- Verify no clipping or offset.

4. Scenario D (Fast drag)

- Click "입어보기".
- Drag quickly and release immediately.
- Verify blob generation succeeds and preview appears.

## Acceptance Criteria

- No crash / no unhandled promise rejection.
- Capture blob generation success rate: 100% in scenarios A-D.
- Captured preview dimensions and aspect ratio align with selection box.
- Aggregate scenario accuracy >= 95%.
- Escape cancel restores plugin visibility and exits capture mode.

## Metrics to Track

- Capture failure rate.
- Cancel cleanup failure rate.
- "Capture area mismatch" user reports.
