const REQUEST_TYPE = 'THATZFIT_CAPTURE_VISIBLE_TAB_REQUEST';
const RESPONSE_TYPE = 'THATZFIT_CAPTURE_VISIBLE_TAB_RESPONSE';

window.addEventListener('message', (event) => {
  const request = event.data;
  if (!request || request.type !== REQUEST_TYPE || !request.requestId) {
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
        type: RESPONSE_TYPE,
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
