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

## Current Fix Notes

The working `html2canvas` path depends on keeping one coordinate system from
selection through render:

1. Selection start/end use `MouseEvent.clientX/clientY`.
2. The selection rectangle is clamped to `getCaptureWindow()` viewport bounds.
3. `Html2CanvasCaptureEngine` converts the viewport rectangle to a document
   rectangle only once:
   - `x = rect.left + captureWindow.scrollX`
   - `y = rect.top + captureWindow.scrollY`
4. `html2canvas` renders `captureDocument.body` with the same
   `captureWindow.scrollX/scrollY`, `windowWidth`, and `windowHeight`.
5. Elements marked as ThatzFit capture UI are excluded from the cloned capture
   tree so the overlay, selection frame, iframe wrapper, plugin panel, and entry
   button do not contaminate the captured image.
6. The capture overlay is hidden immediately before rendering and restored in
   `finally`, so success, failure, and cancel paths all return the plugin to a
   visible state.

The original offset/blank-looking captures were caused by mixing iframe and host
window coordinates and by leaving capture UI in the render tree. A non-null blob
with normal pixel samples meant the image was not empty; the selected document
region was wrong or visually contaminated.

## Capture Debug Logging

Capture logs are disabled by default. Keep them off in normal development and
demo sessions because they are noisy and include runtime capture state such as
selection rectangles, viewport sizes, URLs, blob details, and DOM visibility.

Debug logs use this prefix:

```text
[ThatzFit-FE][capture-debug]
```

The toggle covers `captureDebugInfo`, `captureDebugWarn`, `captureDebugError`,
and plugin-entry stylesheet diagnostics.

To re-enable logs persistently in the browser:

```js
localStorage.setItem('THATZFIT_CAPTURE_DEBUG', 'true');
location.reload();
```

To turn them off again:

```js
localStorage.removeItem('THATZFIT_CAPTURE_DEBUG');
location.reload();
```

To enable logs for the current runtime only:

```js
window.__THATZFIT_CAPTURE_DEBUG__ = true;
```

This runtime flag is not persisted. Set it in the same frame/context where the
ThatzFit FE bundle is executing before reproducing the capture flow.

To enable logs from the dev/build environment:

```sh
VITE_THATZFIT_CAPTURE_DEBUG=true pnpm dev
```

For the demo site iframe, select the `thatzfit-iframe` context in DevTools
before setting the runtime flag. If the FE bundle is executing in the host
window instead, set the flag or localStorage value from the host context.

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
