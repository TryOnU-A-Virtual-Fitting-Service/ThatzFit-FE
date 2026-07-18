# Plugin Entry Position and Demo Lifecycle Design

## Goal

Keep the ThatzFit entry icon, close icon, hint, and plugin panel in one grouped positioning system, and make the local shopping-mall demo command release every resource it creates when the demo ends.

## Scope

- Update `ThatzFit-FE` so one CSS position token controls the entry control, hint, and plugin panel as a group.
- Keep the existing entry image, close icon, hint, analytics events, and open/close behavior.
- Update the local-only `../setup-shoppingmall-demo.sh` lifecycle. The script remains outside the FE repository and must not be committed.
- Do not change backend schemas or production infrastructure.

## Frontend Design

`PluginEntryButton` will always render one fixed 48 by 48 pixel anchor container. The activate and deactivate buttons will be position-neutral children that fill this anchor. State changes replace only the child control, so both visual states inherit the same screen coordinates from the same DOM element.

The parent document will own one inherited CSS custom property:

```css
--thatzfit-entry-bottom: 24px;
```

All vertical placement derives from this token:

- Entry image or close control: `bottom: var(--thatzfit-entry-bottom, 24px)`.
- Entry hint: `bottom: calc(var(--thatzfit-entry-bottom, 24px) + 36px)`.
- Plugin panel: `bottom: calc(var(--thatzfit-entry-bottom, 24px) + 48px + 12px)`.

The 48 pixel term is the entry control height and the 12 pixel term is the approved visual gap between the control and the panel. For a demo input of `100`, the control is at `100px`, the hint at `136px`, and the panel at `160px`. Changing the one token moves all three elements together while preserving their internal spacing.

The anchor exposes a stable `data-thatzfit-entry-position` selector. Its z-index is `1000001`, above the hint at `1000000` and the plugin panel at `999999`, so the entry control remains clickable even if a host layout creates an unexpected overlap.

The button-specific styles remain separate:

- Activate: transparent background, hidden overflow, existing branded image treatment.
- Deactivate: white background, existing X icon, padding, and hover behavior.

The local demo injector sets only `--thatzfit-entry-bottom` on the parent document. It does not calculate unrelated absolute bottom values for each component.

## Demo Script Lifecycle

The command runs as a foreground supervisor after setup:

1. Validate URL and bottom offset.
2. Idempotently allow the root and `www` hosts in the backend.
3. Download CDN assets into a dedicated temporary directory.
4. Launch a dedicated Chrome process with a dedicated temporary profile.
5. Inject the plugin and verify the configured anchor position.
6. Stay alive while Chrome is available so the user can record the demo.
7. On Chrome exit, `Ctrl+C`, `SIGTERM`, setup failure, or normal script exit, run one idempotent cleanup path.

Cleanup terminates only the exact Chrome PID started or discovered for the script's private CDP port. It then removes only temporary paths created with the script's known `thatzfit-demo-assets.*` and `thatzfit-demo-chrome.*` prefixes. Backend domain allowance is persistent configuration and is not rolled back.

## Trust Boundaries and Failure Handling

- The frontend remains responsible only for rendering and state transitions.
- The backend remains responsible for host authorization; no authentication behavior changes.
- The local script trusts the configured SSH target, API origin, CDN origin, and Chrome binary as before.
- Cleanup never searches for or terminates generic Chrome processes.
- Repeated cleanup calls must succeed without deleting unrelated paths or masking the original exit code.
- If Chrome does not stop after a graceful timeout, cleanup may force-stop only the validated dedicated PID.
- If the host page replaces its JavaScript execution context during bundle transfer, the injector discards the partial transfer and retries the complete installation.

## Verification

- Type-check, lint, and production-build `ThatzFit-FE`.
- Add a deterministic source-level verification for the shared position anchor because this repository has no component-test runner.
- Run the script's self-test, including temporary-path validation and cleanup idempotency.
- Run a full demo smoke test and verify:
  - activate and deactivate controls have identical viewport-relative offsets and dimensions;
  - the requested bottom offset is applied through `--thatzfit-entry-bottom`;
  - the hint and panel derive their expected offsets from the same token;
  - the open panel sits 12 pixels above the 48 pixel entry control without overlap;
  - the close control wins the hit test over the iframe and closes the panel through a real CDP mouse event;
  - closing Chrome makes the script exit;
  - the dedicated Chrome PID, CDP listener, asset directory, and profile directory no longer exist afterward.
- Confirm no task-created browser process remains, then commit and push only the FE repository changes.
