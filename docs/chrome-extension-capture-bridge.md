# Chrome Extension Capture Bridge

This branch adds an experimental capture engine enabled by:

```env
VITE_CAPTURE_ENGINE=chrome-extension
```

The frontend cannot call `chrome.tabs.captureVisibleTab()` from a normal web
page or iframe. A Chrome extension/content script must provide a bridge that
returns a visible-tab screenshot data URL.

## Message contract

The frontend posts this message to the parent page window:

```ts
type CaptureRequest = {
  type: 'THATZFIT_CAPTURE_VISIBLE_TAB_REQUEST';
  requestId: string;
  debugTraceId?: string;
  rect: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  viewport: {
    width: number;
    height: number;
    scrollX: number;
    scrollY: number;
    devicePixelRatio: number;
  };
  format: 'png';
};
```

The extension/content script should respond to the request source with:

```ts
type CaptureResponse = {
  type: 'THATZFIT_CAPTURE_VISIBLE_TAB_RESPONSE';
  requestId: string;
  ok: boolean;
  dataUrl?: string;
  error?: string;
};
```

`dataUrl` should be the full visible-tab screenshot returned by
`chrome.tabs.captureVisibleTab()`. The frontend crops the selected viewport
rect using the returned image size and current viewport size.

## Minimal extension-side shape

Content script:

```ts
window.addEventListener('message', async (event) => {
  if (event.data?.type !== 'THATZFIT_CAPTURE_VISIBLE_TAB_REQUEST') {
    return;
  }

  const response = await chrome.runtime.sendMessage(event.data);
  event.source?.postMessage(
    {
      type: 'THATZFIT_CAPTURE_VISIBLE_TAB_RESPONSE',
      requestId: event.data.requestId,
      ...response,
    },
    { targetOrigin: event.origin },
  );
});
```

Extension service worker:

```ts
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request?.type !== 'THATZFIT_CAPTURE_VISIBLE_TAB_REQUEST') {
    return false;
  }

  chrome.tabs.captureVisibleTab(
    undefined,
    { format: 'png' },
    (dataUrl) => {
      const error = chrome.runtime.lastError;
      if (error || !dataUrl) {
        sendResponse({ ok: false, error: error?.message ?? 'No data URL' });
        return;
      }

      sendResponse({ ok: true, dataUrl });
    },
  );

  return true;
});
```

Required extension permissions depend on the final packaging strategy, but
`activeTab` or host permissions are typically needed for visible-tab capture.
