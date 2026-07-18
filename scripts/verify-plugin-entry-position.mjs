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
