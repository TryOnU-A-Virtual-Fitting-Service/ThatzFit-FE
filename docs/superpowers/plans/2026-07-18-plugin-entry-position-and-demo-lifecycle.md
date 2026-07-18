# Grouped Plugin Position and Demo Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entry image, close control, hint, and plugin panel move as one vertical group from a single bottom offset, while preserving the local demo command's complete resource cleanup.

**Architecture:** A shared frontend position contract exports the three CSS expressions derived from `--thatzfit-entry-bottom`. The entry React portal and the parent-document runtime panel style consume that contract, while the local demo injector sets only the root CSS custom property and verifies the resulting geometry through Chrome DevTools Protocol.

**Tech Stack:** React 19, TypeScript 5.8, Vite 7, Node.js 22, Bash, Chrome DevTools Protocol

## Global Constraints

- `--thatzfit-entry-bottom` has a frontend fallback of `24px`.
- Entry image and close control use the token directly; the hint adds `36px`; the plugin panel adds `60px` (`48px` control height plus `12px` gap).
- Entry anchor z-index remains `1000001`, hint remains `1000000`, and plugin panel remains `999999`.
- Keep existing entry image, close icon, hint, analytics events, and open/close behavior.
- Do not add frontend dependencies or change backend schemas or production infrastructure.
- Cleanup may terminate only the exact Chrome PID validated against the private CDP port and temporary profile.
- Backend domain authorization persists after the local demo exits.
- `../setup-shoppingmall-demo.sh` is local-only and must not be added to the FE repository.

---

### Task 1: Shared Frontend Group Position Contract

**Files:**
- Create: `src/Shared/Config/PluginPosition.ts`
- Modify: `src/Shared/Config/index.ts`
- Modify: `src/Features/PluginEntry/Ui/PluginEntryButton/PluginEntryButton.tsx`
- Modify: `src/Apps/Model/initializeThatzfitStyle.ts`
- Modify: `scripts/verify-plugin-entry-position.mjs`

**Interfaces:**
- Consumes: inherited parent-document CSS custom property `--thatzfit-entry-bottom`.
- Produces: `PLUGIN_ENTRY_BOTTOM`, `PLUGIN_ENTRY_HINT_BOTTOM`, and `PLUGIN_PANEL_BOTTOM` string constants.
- Produces: entry/hint/panel computed bottoms of `token`, `token + 36px`, and `token + 60px` respectively.

- [ ] **Step 1: Extend the source contract test before creating the position module**

Read `PluginPosition.ts` with a missing-file fallback and assert the exact constants, imports, and consumers:

```js
const positionSource = await readFile(
  new URL('../src/Shared/Config/PluginPosition.ts', import.meta.url),
  'utf8',
).catch(() => '');
const runtimeStyleSource = await readFile(
  new URL('../src/Apps/Model/initializeThatzfitStyle.ts', import.meta.url),
  'utf8',
);

assert.match(
  positionSource,
  /export const PLUGIN_ENTRY_BOTTOM =\s*'var\(--thatzfit-entry-bottom, 24px\)'/,
);
assert.match(
  positionSource,
  /export const PLUGIN_ENTRY_HINT_BOTTOM =\s*'calc\(var\(--thatzfit-entry-bottom, 24px\) \+ 36px\)'/,
);
assert.match(
  positionSource,
  /export const PLUGIN_PANEL_BOTTOM =\s*'calc\(var\(--thatzfit-entry-bottom, 24px\) \+ 60px\)'/,
);
assert.match(source, /bottom: PLUGIN_ENTRY_BOTTOM/);
assert.match(source, /bottom: PLUGIN_ENTRY_HINT_BOTTOM/);
assert.match(runtimeStyleSource, /bottom: \$\{PLUGIN_PANEL_BOTTOM\} !important/);
```

- [ ] **Step 2: Run the contract test and verify RED**

Run: `pnpm test:plugin-entry-position`

Expected: FAIL on the first `PLUGIN_ENTRY_BOTTOM` assertion because `PluginPosition.ts` does not exist yet.

- [ ] **Step 3: Add the minimal shared position contract and consumers**

Create `src/Shared/Config/PluginPosition.ts`:

```ts
export const PLUGIN_ENTRY_BOTTOM =
  'var(--thatzfit-entry-bottom, 24px)';
export const PLUGIN_ENTRY_HINT_BOTTOM =
  'calc(var(--thatzfit-entry-bottom, 24px) + 36px)';
export const PLUGIN_PANEL_BOTTOM =
  'calc(var(--thatzfit-entry-bottom, 24px) + 60px)';
```

Export the three constants from `src/Shared/Config/index.ts`. Import the entry and hint constants into `PluginEntryButton.tsx`, replacing literal `24px` and `60px` bottom values. Import `PLUGIN_PANEL_BOTTOM` into `initializeThatzfitStyle.ts` and interpolate it into `.thatzfit-desktop`:

```ts
style.textContent = `
  .thatzfit-desktop {
    bottom: ${PLUGIN_PANEL_BOTTOM} !important;
  }
`;
```

The generated CSS rule must be:

```css
bottom: calc(var(--thatzfit-entry-bottom, 24px) + 60px) !important;
```

- [ ] **Step 4: Verify GREEN and the complete frontend build**

Run:

```bash
pnpm test:plugin-entry-position
pnpm ts:check
pnpm lint
pnpm build:prod
git diff --check
```

Expected: all commands exit `0`; the focused test prints `plugin-entry-position: ok`.

- [ ] **Step 5: Commit the frontend behavior**

```bash
git add scripts/verify-plugin-entry-position.mjs src/Shared/Config/PluginPosition.ts src/Shared/Config/index.ts src/Features/PluginEntry/Ui/PluginEntryButton/PluginEntryButton.tsx src/Apps/Model/initializeThatzfitStyle.ts
git commit -m "fix: move plugin controls as one group"
```

### Task 2: Single-Token Local Demo Injection

**Files:**
- Modify locally, do not commit: `../setup-shoppingmall-demo.sh`

**Interfaces:**
- Consumes: integer `BUTTON_BOTTOM` in the inclusive range `60..600`.
- Produces: parent-document `--thatzfit-entry-bottom: ${BUTTON_BOTTOM}px`.
- Produces: CDP smoke evidence for entry bottom, hint bottom, panel bottom, 12px panel-to-control gap, close-button hit testing, and cleanup.

- [ ] **Step 1: Extend the local self-test before changing the injector**

Require the injector source to set exactly the shared root token, reject independent shadow bottom overrides, and require grouped geometry fields:

```bash
if [[ "$injection_source" != *'--thatzfit-entry-bottom'* \
  || "$injection_source" != *'panelBottomOffset'* \
  || "$injection_source" != *'panelToEntryGap'* ]]; then
  printf 'self-test: grouped position contract missing\n' >&2
  return 1
fi
if [[ "$injection_source" == *'shoppingmall-demo-position'* ]]; then
  printf 'self-test: independent entry bottom override remains\n' >&2
  return 1
fi
```

- [ ] **Step 2: Run the script self-test and verify RED**

Run: `../setup-shoppingmall-demo.sh --self-test`

Expected: FAIL with `self-test: grouped position contract missing` because the injector still writes independent anchor and hint bottom values.

- [ ] **Step 3: Replace independent offsets with the shared token**

Remove `HINT_BOTTOM` from Bash input resolution and Node arguments. In the navigation-safe `install()` expression, set the custom property before loading the frontend module:

```js
document.documentElement.style.setProperty(
  '--thatzfit-entry-bottom',
  `${buttonBottom}px`,
);
```

Delete the `shoppingmall-demo-position` shadow style block. The script must no longer calculate or inject per-element bottom values.

- [ ] **Step 4: Verify initial and open grouped geometry**

Before opening, read the root token, entry rectangle, and hint rectangle. After opening, read the panel rectangle and assert:

```js
const expectedHintBottom = buttonBottom + 36;
const expectedPanelBottom = buttonBottom + 60;
const panelToEntryGap = entryRect.top - panelRect.bottom;
```

All comparisons use a `0.01px` tolerance. Require root token `${buttonBottom}px`, entry bottom `buttonBottom`, hint bottom `expectedHintBottom`, panel bottom `expectedPanelBottom`, entry size `48x48`, and panel-to-entry gap `12px`. Preserve the real `Input.dispatchMouseEvent` close test and log:

```text
plugin=ready button_bottom=100 hint_bottom=136 panel_bottom=160 group_gap=12
```

- [ ] **Step 5: Verify GREEN and lifecycle deterministically**

Run:

```bash
bash -n ../setup-shoppingmall-demo.sh
../setup-shoppingmall-demo.sh --self-test
```

Expected: syntax exits `0` and self-test prints `self-test: ok`.

### Task 3: Local-Build Browser Regression and Cleanup

**Files:**
- Verify: `dist/asset-manifest.json` and built assets.
- Verify: `../setup-shoppingmall-demo.sh`.
- Commit: no local script changes.

**Interfaces:**
- Consumes: the production FE build through `THATZFIT_CDN_BASE_URL` and the existing backend host authorization.
- Produces: geometry and real-click evidence against `https://cherrykoko.com` plus proof that task-created resources are removed.

- [ ] **Step 1: Serve the production build on loopback**

Copy `dist` under a temporary `plugin/` directory and start a loopback-only HTTP server. Install an EXIT trap in the harness so the server and its temporary directory are always removed.

- [ ] **Step 2: Run the demo at `100px` against the local build**

Run `../setup-shoppingmall-demo.sh https://cherrykoko.com 100` with `THATZFIT_CDN_BASE_URL` pointing to the loopback server. Let the script's built-in smoke verify the CSS token, grouped geometry, panel gap, and actual close click.

- [ ] **Step 3: Close the dedicated browser and verify cleanup**

Close only the private CDP browser created by this run. Expected within the script timeout:

- demo command exits `0`;
- dedicated Chrome PID no longer exists;
- private CDP port no longer listens;
- `thatzfit-demo-assets.*` and `thatzfit-demo-chrome.*` paths from the run no longer exist;
- the pre-existing user demo browser on port `9222`, if still present, remains untouched.

### Task 4: Publish, CDN Verification, and Final Live Smoke

**Files:**
- Verify: Git history, GitHub Actions deployment, CDN manifest and entry bundle.
- Commit: only tracked frontend source, test, plan, and generated lock-free source changes.

**Interfaces:**
- Consumes: `origin/main` deployment workflow and `https://cdn.thatzfit.me/plugin/asset-manifest.json`.
- Produces: remote-main parity, successful CDN deployment, and a live-CDN grouped-position smoke run.

- [ ] **Step 1: Run fresh repository verification**

```bash
pnpm test:plugin-entry-position
pnpm ts:check
pnpm lint
pnpm build:prod
git diff --check
git status --short
```

Expected: all validation exits `0`; the local-only demo script is absent from FE git status.

- [ ] **Step 2: Push `main` and verify the deployment workflow**

```bash
git push origin main
git fetch origin main
git rev-parse HEAD
git rev-parse origin/main
git ls-remote origin refs/heads/main
```

Expected: all three hashes are identical. Wait for the frontend CDN workflow for that commit to reach `success`.

- [ ] **Step 3: Verify the deployed bundle contains the group contract**

Download the live manifest and entry asset, then assert the bundle contains `--thatzfit-entry-bottom` and the `+ 60px` panel expression.

- [ ] **Step 4: Run the live-CDN demo smoke at `100px`**

Run `../setup-shoppingmall-demo.sh https://cherrykoko.com 100` without a CDN override. Confirm the ready log reports `button_bottom=100`, `hint_bottom=136`, `panel_bottom=160`, and `group_gap=12`, then close only that run's Chrome and verify its resources are gone.

- [ ] **Step 5: Verify browser hygiene and remote parity once more**

```bash
ps -axo pid,ppid,args | grep -E "playwright-core/lib/entry/cliDaemon.js|playwright-mcp|playwright_chromiumdev_profile|/Applications/Google Chrome.app" | grep -v grep
git status --short
git rev-parse HEAD
git rev-parse origin/main
```

Expected: no task-created browser remains, the FE worktree is clean, and `HEAD` equals `origin/main`. A pre-existing user Chrome session is reported separately and preserved.
