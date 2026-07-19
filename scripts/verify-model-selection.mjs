import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import ts from 'typescript';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const resolverPath = resolve(
  rootDir,
  'src/Entities/FittingModel/Model/resolveCurrentFittingModel.ts',
);
const fittingPagePath = resolve(
  rootDir,
  'src/Pages/Plugin/Ui/FittingPage/FittingPage.tsx',
);
const fittingHistoryItemPath = resolve(
  rootDir,
  'src/Features/FittingHistory/Ui/FittingHistoryListItem/FittingHistoryListItem.tsx',
);

assert.ok(
  existsSync(resolverPath),
  'model selection resolver is missing; add resolveCurrentFittingModel.ts',
);

const resolverSource = readFileSync(resolverPath, 'utf8');
const transpiled = ts.transpileModule(resolverSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;

const sandbox = {
  module: { exports: {} },
};
sandbox.exports = sandbox.module.exports;

vm.runInNewContext(transpiled, sandbox, { filename: resolverPath });

const { resolveCurrentFittingModel } = sandbox.module.exports;

assert.equal(
  typeof resolveCurrentFittingModel,
  'function',
  'resolveCurrentFittingModel must be exported',
);

const defaultModels = [
  {
    defaultModelId: 1,
    defaultModelUrl: 'https://cdn.example.com/model-1.png',
    modelName: 'Model 1',
    sortOrder: 1,
    isCustom: false,
  },
  {
    defaultModelId: 2,
    defaultModelUrl: 'https://cdn.example.com/model-2.png',
    modelName: 'Model 2',
    sortOrder: 2,
    isCustom: false,
  },
];

const asPlainObject = (value) => JSON.parse(JSON.stringify(value));

const emptySelection = {
  defaultModelId: 0,
  defaultModelUrl: '',
  imageName: '',
  modelName: '',
};

assert.deepEqual(
  asPlainObject(
    resolveCurrentFittingModel({
      currentFittingModel: emptySelection,
      fittingModelList: defaultModels,
    }),
  ),
  {
    defaultModelId: 1,
    defaultModelUrl: 'https://cdn.example.com/model-1.png',
    imageName: 'model-1.png',
    modelName: 'Model 1',
  },
  'empty state should initialize to the first available model',
);

const selectedModel = {
  defaultModelId: 2,
  defaultModelUrl: 'https://cdn.example.com/try-on-result.png',
  imageName: 'try-on-result.png',
  modelName: 'Model 2',
};

const legacyHistorySelection = {
  defaultModelId: 99,
  defaultModelUrl: 'https://cdn.example.com/legacy-try-on-result.png',
  imageName: 'legacy-try-on-result.png',
  modelName: 'Model 1',
  selectionSource: 'history',
};

assert.equal(
  resolveCurrentFittingModel({
    currentFittingModel: legacyHistorySelection,
    fittingModelList: defaultModels,
  }),
  legacyHistorySelection,
  'a clicked history result must remain active even when its URL is not a default model URL',
);

assert.equal(
  resolveCurrentFittingModel({
    currentFittingModel: selectedModel,
    fittingModelList: [...defaultModels],
  }),
  selectedModel,
  'an existing selected model must not be reset when the list query refreshes',
);

assert.deepEqual(
  asPlainObject(
    resolveCurrentFittingModel({
      currentFittingModel: {
        defaultModelId: 99,
        defaultModelUrl: 'https://cdn.example.com/deleted-model.png',
        imageName: 'deleted-model.png',
        modelName: 'Deleted model',
      },
      fittingModelList: defaultModels,
    }),
  ),
  {
    defaultModelId: 1,
    defaultModelUrl: 'https://cdn.example.com/model-1.png',
    imageName: 'model-1.png',
    modelName: 'Model 1',
  },
  'a deleted selected model should fall back to the first available model',
);

assert.deepEqual(
  asPlainObject(
    resolveCurrentFittingModel({
      currentFittingModel: selectedModel,
      fittingModelList: [],
    }),
  ),
  selectedModel,
  'an empty model list should not clear the existing selected model',
);

const fittingPageSource = readFileSync(fittingPagePath, 'utf8');
const fittingHistoryItemSource = readFileSync(fittingHistoryItemPath, 'utf8');

assert.match(
  fittingPageSource,
  /resolveCurrentFittingModel/,
  'FittingPage must use the resolver instead of unconditionally selecting fittingModelList[0]',
);

assert.doesNotMatch(
  fittingPageSource,
  /setCurrentFittingModel\(\s*\{\s*defaultModelUrl:\s*fittingModelList\[0\]/s,
  'FittingPage must not reset the current model directly from fittingModelList[0]',
);

assert.match(
  fittingHistoryItemSource,
  /selectionSource:\s*'history'/,
  'history clicks must explicitly mark the current selection as history',
);
assert.match(
  fittingHistoryItemSource,
  /aria-pressed=\{isSelected\}/,
  'the selected history item must expose its active state',
);
assert.match(
  fittingHistoryItemSource,
  /isSelected[\s\S]*border-black/,
  'the selected history item must have a visible active style',
);

console.log('model selection regression checks passed');
