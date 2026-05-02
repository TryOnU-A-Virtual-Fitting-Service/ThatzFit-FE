const REQUEST_TYPE = 'THATZFIT_CAPTURE_VISIBLE_TAB_REQUEST';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!request || request.type !== REQUEST_TYPE || !request.requestId) {
    return false;
  }

  const windowId = sender.tab?.windowId;
  chrome.tabs.captureVisibleTab(windowId, { format: 'png' }, (dataUrl) => {
    const runtimeError = chrome.runtime.lastError;
    if (runtimeError || !dataUrl) {
      sendResponse({
        ok: false,
        error: runtimeError?.message ?? 'captureVisibleTab returned no data URL',
      });
      return;
    }

    sendResponse({
      ok: true,
      dataUrl,
    });
  });

  return true;
});
