# Plugin Entry Position and Demo Lifecycle Design

## Goal

Keep the ThatzFit entry icon and close icon on the exact same fixed-position anchor, and make the local shopping-mall demo command release every resource it creates when the demo ends.

## Scope

- Update `ThatzFit-FE` so one positioning container owns the entry control's `right`, `bottom`, size, and z-index.
- Keep the existing entry image, close icon, hint, analytics events, and open/close behavior.
- Update the local-only `../setup-shoppingmall-demo.sh` lifecycle. The script remains outside the FE repository and must not be committed.
- Do not change backend schemas or production infrastructure.

## Frontend Design

`PluginEntryButton` will always render one fixed 48 by 48 pixel anchor container. The activate and deactivate buttons will be position-neutral children that fill this anchor. State changes replace only the child control, so both visual states inherit the same screen coordinates from the same DOM element.

The anchor will expose a stable `data-thatzfit-entry-position` selector. The demo injector will apply its requested bottom offset to this anchor. The hint keeps its offset relative to the same requested bottom value.

The button-specific styles remain separate:

- Activate: transparent background, hidden overflow, existing branded image treatment.
- Deactivate: white background, existing X icon, padding, and hover behavior.

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

## Verification

- Type-check, lint, and production-build `ThatzFit-FE`.
- Add a deterministic source-level verification for the shared position anchor because this repository has no component-test runner.
- Run the script's self-test, including temporary-path validation and cleanup idempotency.
- Run a full demo smoke test and verify:
  - activate and deactivate button rectangles have identical coordinates;
  - the requested bottom offset is applied to the shared anchor;
  - closing Chrome makes the script exit;
  - the dedicated Chrome PID, CDP listener, asset directory, and profile directory no longer exist afterward.
- Confirm no task-created browser process remains, then commit and push only the FE repository changes.
