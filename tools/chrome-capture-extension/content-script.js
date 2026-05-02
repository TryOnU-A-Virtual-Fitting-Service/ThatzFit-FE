const CAPTURE_REQUEST_TYPE = 'THATZFIT_CAPTURE_VISIBLE_TAB_REQUEST';
const CAPTURE_RESPONSE_TYPE = 'THATZFIT_CAPTURE_VISIBLE_TAB_RESPONSE';
const TOGGLE_REQUEST_TYPE = 'THATZFIT_EXTENSION_TOGGLE_PLUGIN';
const CDN_BASE_URL = 'https://cdn.thatz.fit/plugin';
const PLUGIN_ROOT_ID = 'thatzfit-plugin';
const ENTRY_ID = 'thatzfit-entry';
const IFRAME_WRAPPER_ID = 'thatzfit-iframe-wrapper';
const IFRAME_ID = 'thatzfit-iframe';
const ROOT_ID = 'thatzfit-root';

const debug = (step, details = {}) => {
  console.info('[ThatzFit-Extension][debug]', {
    step,
    ...details,
  });
};

const toAssetUrl = (file) =>
  `${CDN_BASE_URL}/${file.replace(/^\/+/, '').replace(/^plugin\//, '')}`;

const loadAssetManifest = async () => {
  const response = await fetch(`${CDN_BASE_URL}/asset-manifest.json`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load asset manifest: ${response.status}`);
  }

  return response.json();
};

const collectImportedFiles = (manifest, entryIds, visited = new Set()) => {
  if (!entryIds?.length) {
    return [];
  }

  const files = [];
  for (const entryId of entryIds) {
    if (visited.has(entryId)) {
      continue;
    }

    visited.add(entryId);
    const entry = manifest[entryId];
    if (!entry) {
      throw new Error(`Missing imported manifest entry: ${entryId}`);
    }

    if (entry.file) {
      files.push(entry.file);
    }

    files.push(...collectImportedFiles(manifest, entry.imports, visited));
  }

  return [...new Set(files)];
};

const getPluginAssets = async () => {
  const manifest = await loadAssetManifest();
  const entry = manifest['src/Apps/main.tsx'];
  if (!entry?.file) {
    throw new Error('Plugin entry asset is missing from asset manifest');
  }

  const cssFiles = entry.css ?? [];
  if (!cssFiles.length) {
    throw new Error('Plugin CSS asset is missing from asset manifest');
  }

  return {
    scriptUrl: toAssetUrl(entry.file),
    stylesheetUrls: cssFiles.map(toAssetUrl),
    modulePreloadUrls: collectImportedFiles(manifest, entry.imports).map(
      toAssetUrl,
    ),
  };
};

const ensureHostAnchors = () => {
  let pluginRoot = document.getElementById(PLUGIN_ROOT_ID);
  if (!pluginRoot) {
    pluginRoot = document.createElement('div');
    pluginRoot.id = PLUGIN_ROOT_ID;
    (document.body ?? document.documentElement).appendChild(pluginRoot);
  }

  let entry = document.getElementById(ENTRY_ID);
  if (!entry) {
    entry = document.createElement('div');
    entry.id = ENTRY_ID;
    pluginRoot.appendChild(entry);
  }

  let iframeWrapper = document.getElementById(IFRAME_WRAPPER_ID);
  if (!iframeWrapper) {
    iframeWrapper = document.createElement('div');
    iframeWrapper.id = IFRAME_WRAPPER_ID;
    pluginRoot.appendChild(iframeWrapper);
  }

  let iframe = document.getElementById(IFRAME_ID);
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    iframe.title = 'thatzfit virtual fitting';
    iframe.allow = 'clipboard-write';
    iframe.setAttribute(
      'style',
      'position:relative !important;z-index:999999 !important;display:block !important;color-scheme:normal !important;white-space:normal !important;border:none !important;',
    );
    iframeWrapper.appendChild(iframe);
  }

  return { iframe };
};

const writePluginIframe = (iframe, assets) => {
  const iframeDocument = iframe.contentWindow?.document;
  if (!iframeDocument) {
    throw new Error('Plugin iframe document is unavailable');
  }

  const preloadLinks = assets.modulePreloadUrls
    .map((url) => `    <link rel="modulepreload" href="${url}" />`)
    .join('\n');
  const stylesheetLinks = assets.stylesheetUrls
    .map((url) => `    <link rel="stylesheet" href="${url}" />`)
    .join('\n');

  iframeDocument.open();
  iframeDocument.write(`<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
${preloadLinks}
${stylesheetLinks}
  </head>
  <body>
    <div id="${ROOT_ID}"></div>
    <script type="module" src="${assets.scriptUrl}"></script>
  </body>
</html>`);
  iframeDocument.close();
};

const waitForEntryButton = () =>
  new Promise((resolve, reject) => {
    const deadline = Date.now() + 7000;

    const tick = () => {
      const shadowRoot = document.getElementById(ENTRY_ID)?.shadowRoot;
      const button = shadowRoot?.querySelector('button');
      if (button) {
        resolve(button);
        return;
      }

      if (Date.now() > deadline) {
        reject(new Error('ThatzFit entry button was not mounted'));
        return;
      }

      window.setTimeout(tick, 100);
    };

    tick();
  });

const ensurePluginRuntime = async () => {
  const { iframe } = ensureHostAnchors();
  if (!iframe.dataset.thatzfitInjected) {
    const entryShadowRoot = document.getElementById(ENTRY_ID)?.shadowRoot;
    if (entryShadowRoot) {
      entryShadowRoot.innerHTML = '';
    }

    const assets = await getPluginAssets();
    writePluginIframe(iframe, assets);
    iframe.dataset.thatzfitInjected = 'true';
    debug('plugin_runtime_injected', assets);
  }
};

const togglePlugin = async () => {
  await ensurePluginRuntime();
  const entryButton = await waitForEntryButton();
  entryButton.click();
  debug('plugin_entry_button_clicked');
};

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request?.type !== TOGGLE_REQUEST_TYPE) {
    return false;
  }

  togglePlugin()
    .then(() => sendResponse({ ok: true }))
    .catch((error) => {
      console.error('[ThatzFit-Extension][error]', error);
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    });

  return true;
});

window.addEventListener('message', (event) => {
  const request = event.data;
  if (
    !request ||
    request.type !== CAPTURE_REQUEST_TYPE ||
    !request.requestId
  ) {
    return;
  }

  chrome.runtime.sendMessage(request, (response) => {
    const runtimeError = chrome.runtime.lastError;
    const payload = runtimeError
      ? {
          ok: false,
          error: runtimeError.message,
        }
      : response;

    event.source?.postMessage(
      {
        type: CAPTURE_RESPONSE_TYPE,
        requestId: request.requestId,
        ...(payload ?? {
          ok: false,
          error: 'No extension response',
        }),
      },
      {
        targetOrigin: event.origin,
      },
    );
  });
});
