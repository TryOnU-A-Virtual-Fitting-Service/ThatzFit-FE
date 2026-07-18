import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(
  new URL(
    '../src/Features/PluginEntry/Ui/PluginEntryButton/PluginEntryButton.tsx',
    import.meta.url,
  ),
  'utf8',
);
const positionSource = await readFile(
  new URL('../src/Shared/Config/PluginPosition.ts', import.meta.url),
  'utf8',
).catch(() => '');
const configIndexSource = await readFile(
  new URL('../src/Shared/Config/index.ts', import.meta.url),
  'utf8',
);
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
assert.match(
  configIndexSource,
  /PLUGIN_ENTRY_BOTTOM,[\s\S]*PLUGIN_ENTRY_HINT_BOTTOM,[\s\S]*PLUGIN_PANEL_BOTTOM,[\s\S]*from '.\/PluginPosition'/,
);
assert.match(source, /bottom: PLUGIN_ENTRY_BOTTOM/);
assert.match(source, /bottom: PLUGIN_ENTRY_HINT_BOTTOM/);
assert.match(
  runtimeStyleSource,
  /bottom: \$\{PLUGIN_PANEL_BOTTOM\} !important/,
);

assert.match(source, /data-thatzfit-entry-position='true'/);
assert.match(source, /style=\{entryButtonPositionStyle\}/);
assert.match(source, /width: '100%'/);
assert.match(source, /height: '100%'/);
assert.match(
  source,
  /zIndex: 1000001/,
  'entry anchor must stack above the plugin iframe and entry hint',
);
assert.equal(
  (source.match(/\.\.\.entryButtonPositionStyle/g) ?? []).length,
  0,
  'position style must belong only to the shared anchor',
);

console.log('plugin-entry-position: ok');
