import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

import ts from 'typescript';

const modelSource = await readFile(
  new URL(
    '../src/Features/Fitting/Model/mobileProductTryOn.ts',
    import.meta.url,
  ),
  'utf8',
);
const bridgeSource = await readFile(
  new URL(
    '../src/Features/Fitting/Ui/MobileProductTryOnBridge/MobileProductTryOnBridge.tsx',
    import.meta.url,
  ),
  'utf8',
);
const fittingButtonSource = await readFile(
  new URL(
    '../src/Features/Fitting/Ui/FittingButton/FittingButton.tsx',
    import.meta.url,
  ),
  'utf8',
);
const postFittingSource = await readFile(
  new URL('../src/Features/Fitting/Model/usePostFitting.ts', import.meta.url),
  'utf8',
);
const captureEngineSource = await readFile(
  new URL('../src/Features/Fitting/Model/captureEngine.ts', import.meta.url),
  'utf8',
);

const testableModelSource = modelSource.replace(
  /import \{ getDefaultImageProxyUrl \} from '.\/captureEngine';/,
  "const getDefaultImageProxyUrl = () => 'https://api.example/api/v1/try-on/image/proxy';",
);
const transpiledModel = ts.transpileModule(testableModelSource, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const sandbox = {
  AbortSignal,
  URL,
  fetch: () => {
    throw new Error('fetch should not run in contract parsing tests');
  },
  module: { exports: {} },
};
sandbox.exports = sandbox.module.exports;
vm.runInNewContext(transpiledModel, sandbox);

const { buildMobileProductImageProxyUrl, parseMobileProductTryOnRequest } =
  sandbox.module.exports;
const validRequest = {
  version: 1,
  requestId: 'tf-mobile-request_1',
  imageUrl: 'https://cdn.example/product/look.webp?size=large',
  source: 'mobile_product_tag',
};
assert.deepEqual(
  JSON.parse(JSON.stringify(parseMobileProductTryOnRequest(validRequest))),
  validRequest,
);
assert.equal(
  parseMobileProductTryOnRequest({ ...validRequest, version: 2 }),
  null,
);
assert.equal(
  parseMobileProductTryOnRequest({ ...validRequest, requestId: 'bad id' }),
  null,
);
assert.equal(
  parseMobileProductTryOnRequest({
    ...validRequest,
    imageUrl: 'data:image/png;base64,abc',
  }),
  null,
);
assert.equal(
  parseMobileProductTryOnRequest({
    ...validRequest,
    imageUrl: 'https://user:password@cdn.example/look.png',
  }),
  null,
);
assert.match(
  buildMobileProductImageProxyUrl(
    validRequest.imageUrl,
    validRequest.requestId,
  ),
  /responseType=blob/,
);

assert.match(bridgeSource, /new AbortController\(\)/);
assert.match(bridgeSource, /inFlightRef\.current/);
assert.match(
  bridgeSource,
  /const isMobileTouchEnvironment = useMobileTouchEnvironment\(\)/,
);
assert.match(bridgeSource, /!isModelReady \|\| !isMobileTouchEnvironment/);
assert.match(bridgeSource, /!isMobileTouchEnvironment \|\|\s*!request/);
assert.match(bridgeSource, /parseMobileProductTryOnRequest/);
assert.match(bridgeSource, /setCapturedClothingImage\(clothingImage\)/);
assert.match(bridgeSource, /setFittingJobId\(debugTraceId\)/);
assert.match(bridgeSource, /setProductPageUrl\(hostPageUrl\)/);
assert.doesNotMatch(bridgeSource, /postClothesImageDataUrl/);
assert.match(fittingButtonSource, /useMobileTouchEnvironment\(\)/);
assert.match(fittingButtonSource, /disabled=\{isMobileTouchEnvironment\}/);
assert.match(
  postFittingSource,
  /productPageUrl: productPageUrl \?\? undefined/,
);
assert.match(captureEngineSource, /#thatzfit-mobile-product-try-on/);

console.log('mobile product try-on FE checks passed');
