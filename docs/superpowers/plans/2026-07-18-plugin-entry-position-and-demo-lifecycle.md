# Plugin Entry Position and Demo Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the entry image and close icon on one screen anchor and guarantee that the local demo command releases its dedicated Chrome process and temporary files when it ends.

**Architecture:** A fixed 48 by 48 pixel wrapper owns entry positioning while state-specific buttons only fill that wrapper. The local demo script supervises its isolated Chrome in the foreground and funnels normal exit, signals, Chrome closure, and failures through one idempotent cleanup function.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Node.js 22, Bash, Chrome DevTools Protocol

## Global Constraints

- Keep existing entry image, close icon, hint, analytics events, and open/close behavior.
- Do not add frontend dependencies or change backend schemas.
- Cleanup may terminate only the exact Chrome PID validated against the private CDP port and temporary profile.
- Backend domain authorization persists after the local demo exits.
- `../setup-shoppingmall-demo.sh` is local-only and must not be added to the FE repository.

---

### Task 1: Shared Frontend Entry Anchor

**Files:**
- Create: `scripts/verify-plugin-entry-position.mjs`
- Modify: `package.json`
- Modify: `src/Features/PluginEntry/Ui/PluginEntryButton/PluginEntryButton.tsx`

**Interfaces:**
- Consumes: `isPluginOpen: boolean` from `usePluginStore`.
- Produces: one element matching `[data-thatzfit-entry-position='true']` with fixed positioning and one child button filling that element.

- [ ] **Step 1: Add the failing source contract test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(
  new URL(
    '../src/Features/PluginEntry/Ui/PluginEntryButton/PluginEntryButton.tsx',
    import.meta.url,
  ),
  'utf8',
);

assert.match(source, /data-thatzfit-entry-position='true'/);
assert.match(source, /style=\{entryButtonPositionStyle\}/);
assert.match(source, /width: '100%'/);
assert.match(source, /height: '100%'/);
assert.equal(
  (source.match(/\.\.\.entryButtonPositionStyle/g) ?? []).length,
  0,
  'position style must belong only to the shared anchor',
);

console.log('plugin-entry-position: ok');
```

Add to `package.json`:

```json
"test:plugin-entry-position": "node scripts/verify-plugin-entry-position.mjs"
```

- [ ] **Step 2: Run the contract test and verify it fails**

Run: `pnpm test:plugin-entry-position`

Expected: FAIL because `data-thatzfit-entry-position='true'` does not exist.

- [ ] **Step 3: Move fixed positioning to one wrapper**

Keep `entryButtonPositionStyle` fixed at `right: 24px`, `bottom: 24px`, `width: 48px`, and `height: 48px`. Replace button-owned position styles with fill styles:

```tsx
const entryButtonBaseStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  padding: 0,
  border: 0,
  borderRadius: '16px',
  cursor: 'pointer',
};

const entryButtonStyle: CSSProperties = {
  ...entryButtonBaseStyle,
  background: 'transparent',
};

const closeButtonStyle: CSSProperties = {
  ...entryButtonBaseStyle,
  padding: '12px',
  background: '#ffffff',
  color: '#636364',
};
```

Render the state-specific control inside the shared anchor:

```tsx
<div
  data-thatzfit-entry-position='true'
  style={entryButtonPositionStyle}
>
  {isPluginOpen ? (
    <PluginDeactivateButton
      className='cursor-pointer hover:bg-white'
      style={closeButtonStyle}
      onClick={handleClickEntryButton}
    />
  ) : (
    <PluginActivateButton
      className='cursor-pointer transition-opacity duration-300 ease-in-out'
      style={entryButtonStyle}
      onClick={handleClickEntryButton}
    />
  )}
</div>
```

- [ ] **Step 4: Run focused and repository validation**

Run:

```bash
pnpm test:plugin-entry-position
pnpm ts:check
pnpm lint
pnpm build:prod
```

Expected: all commands exit 0 and the focused test prints `plugin-entry-position: ok`.

- [ ] **Step 5: Commit the frontend behavior**

```bash
git add package.json scripts/verify-plugin-entry-position.mjs src/Features/PluginEntry/Ui/PluginEntryButton/PluginEntryButton.tsx
git commit -m "fix: anchor plugin entry controls consistently"
```

### Task 2: Local Demo Resource Supervisor

**Files:**
- Modify locally, do not commit: `../setup-shoppingmall-demo.sh`

**Interfaces:**
- Consumes: `CHROME_PID`, `CDP_PORT`, `CHROME_PROFILE_DIR`, and `ASSET_DIR` created by the existing setup flow.
- Produces: `cleanup()`, `wait_for_demo_end()`, and stable anchor selector injection.

- [ ] **Step 1: Extend self-test with managed-path cleanup checks**

Create temporary directories with the real prefixes, remove them through the cleanup helper, call removal a second time, and assert that a differently named directory is rejected and remains present:

```bash
local test_asset_dir test_profile_dir unmanaged_dir
test_asset_dir="$(mktemp -d "${TMPDIR:-/tmp}/thatzfit-demo-assets.XXXXXX")"
test_profile_dir="$(mktemp -d "${TMPDIR:-/tmp}/thatzfit-demo-chrome.XXXXXX")"
unmanaged_dir="$(mktemp -d "${TMPDIR:-/tmp}/thatzfit-unmanaged.XXXXXX")"
remove_managed_temp_dir "$test_asset_dir" 'thatzfit-demo-assets'
remove_managed_temp_dir "$test_asset_dir" 'thatzfit-demo-assets'
remove_managed_temp_dir "$test_profile_dir" 'thatzfit-demo-chrome'
! remove_managed_temp_dir "$unmanaged_dir" 'thatzfit-demo-assets'
[[ -d "$unmanaged_dir" ]]
rmdir "$unmanaged_dir"
```

- [ ] **Step 2: Run self-test and verify the new contract fails before helpers exist**

Run: `./setup-shoppingmall-demo.sh --self-test`

Expected: FAIL with `remove_managed_temp_dir: command not found`.

- [ ] **Step 3: Add validated, idempotent cleanup helpers**

Implement these boundaries:

```bash
is_managed_temp_dir() {
  local path="$1" prefix="$2" resolved temp_root
  [[ -n "$path" && -d "$path" ]] || return 1
  resolved="$(cd "$path" && pwd -P)" || return 1
  temp_root="$(cd "${TMPDIR:-/tmp}" && pwd -P)" || return 1
  [[ "$(dirname "$resolved")" == "$temp_root" ]]
  [[ "$(basename "$resolved")" == "${prefix}."* ]]
}

remove_managed_temp_dir() {
  local path="$1" prefix="$2"
  [[ -z "$path" || ! -e "$path" ]] && return 0
  is_managed_temp_dir "$path" "$prefix" || return 1
  rm -rf -- "$path"
}

is_owned_chrome_process() {
  local process_args
  [[ -n "$CHROME_PID" && -n "$CDP_PORT" && -n "$CHROME_PROFILE_DIR" ]] || return 1
  process_args="$(ps -p "$CHROME_PID" -o args= 2>/dev/null)" || return 1
  [[ "$process_args" == *"--remote-debugging-port=${CDP_PORT}"* ]]
  [[ "$process_args" == *"--user-data-dir=${CHROME_PROFILE_DIR}"* ]]
}
```

`cleanup()` disables its traps, preserves the incoming exit status, gracefully terminates only an owned Chrome PID, escalates only that PID after a bounded wait, removes the two validated temporary directories, and returns the original status. A re-entry guard makes repeated calls harmless.

- [ ] **Step 4: Update injector selectors and geometry smoke test**

Target the shared anchor for position and query its child button:

```js
const anchorSelector = "[data-thatzfit-entry-position='true']";
style.textContent =
  `${anchorSelector} { bottom: ${buttonBottom}px !important; right: 24px !important; } ` +
  "[data-thatzfit-entry-hint='true'] { " +
  `bottom: ${hintBottom}px !important; right: 56px !important; }`;
```

During the open/close smoke test, record both button rectangles and fail unless `top`, `right`, `bottom`, `left`, `width`, and `height` are identical.

- [ ] **Step 5: Keep the successful demo in the foreground**

Install `EXIT`, `INT`, and `TERM` traps before creating temporary resources. After printing `demo=ready`, call:

```bash
wait_for_demo_end() {
  log 'Chrome is ready for recording. Close it or press Ctrl+C to clean up.'
  while is_owned_chrome_process; do
    sleep 1
  done
  log 'Demo Chrome closed; cleaning up.'
}
```

Expected behavior: Chrome closure or `Ctrl+C` exits the command through `cleanup()`.

- [ ] **Step 6: Run deterministic local checks**

Run:

```bash
bash -n ../setup-shoppingmall-demo.sh
../setup-shoppingmall-demo.sh --self-test
```

Expected: syntax exits 0 and self-test prints `self-test: ok`.

### Task 3: End-to-End Verification and Delivery

**Files:**
- Verify: `dist/asset-manifest.json` and built assets
- Verify: `../setup-shoppingmall-demo.sh`
- Commit: no local script changes

**Interfaces:**
- Consumes: the built FE assets and the foreground demo command.
- Produces: verified geometry, verified cleanup, and pushed `origin/main`.

- [ ] **Step 1: Serve the local production build as a test CDN**

Copy `dist` into a temporary `plugin` directory, start a loopback-only HTTP server, and record its PID. Use `trap` in the test shell so the server and directory are removed on every exit.

- [ ] **Step 2: Start the demo command against local built assets**

Run the command in the background with `THATZFIT_CDN_BASE_URL` set to the loopback server. Wait until its log contains `demo=ready`, then capture its Chrome PID, CDP port, asset directory, and profile directory.

- [ ] **Step 3: Verify both control states share one rectangle**

Use CDP to read the activate button rectangle, click it, read the deactivate button rectangle, and compare all six edges plus width and height. Expected: identical rectangles and the configured bottom offset.

- [ ] **Step 4: Close Chrome and verify complete cleanup**

Send `Browser.close` through the private CDP endpoint. Expected within the bounded timeout:

- demo command exits 0;
- dedicated Chrome PID no longer exists;
- CDP port no longer listens;
- asset and profile directories no longer exist;
- loopback test server and its temporary directory are removed by the test harness.

- [ ] **Step 5: Re-run final FE validation**

```bash
pnpm test:plugin-entry-position
pnpm ts:check
pnpm lint
pnpm build:prod
git diff --check
git status --short
```

Expected: all validation commands exit 0; only the expected committed plan and code history exist in the FE repository.

- [ ] **Step 6: Push and prove remote parity**

```bash
git push origin main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
git ls-remote origin refs/heads/main
```

Expected: all three commit hashes are identical.
