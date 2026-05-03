const DEBUG_PREFIX = '[ThatzFit-FE][capture-debug]';
const DEBUG_STORAGE_KEY = 'THATZFIT_CAPTURE_DEBUG';
const blobDebugTraceIds = new WeakMap<Blob, string>();

type DebugDetails = Record<string, unknown>;

type DebugGlobal = typeof globalThis & {
  __THATZFIT_CAPTURE_DEBUG__?: boolean;
};

export const isCaptureDebugEnabled = () => {
  if (import.meta.env.VITE_THATZFIT_CAPTURE_DEBUG === 'true') {
    return true;
  }

  try {
    const debugGlobal = globalThis as DebugGlobal;
    return (
      debugGlobal.__THATZFIT_CAPTURE_DEBUG__ === true ||
      globalThis.localStorage?.getItem(DEBUG_STORAGE_KEY) === 'true'
    );
  } catch {
    return false;
  }
};

export const createCaptureDebugTraceId = () =>
  `tf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const captureDebugInfo = (
  debugTraceId: string | undefined,
  step: string,
  details: DebugDetails = {},
) => {
  if (!isCaptureDebugEnabled()) {
    return;
  }

  console.info(DEBUG_PREFIX, {
    debugTraceId,
    step,
    ...details,
  });
};

export const captureDebugWarn = (
  debugTraceId: string | undefined,
  step: string,
  details: DebugDetails = {},
) => {
  if (!isCaptureDebugEnabled()) {
    return;
  }

  console.warn(DEBUG_PREFIX, {
    debugTraceId,
    step,
    ...details,
  });
};

export const captureDebugError = (
  debugTraceId: string | undefined,
  step: string,
  details: DebugDetails = {},
) => {
  if (!isCaptureDebugEnabled()) {
    return;
  }

  console.error(DEBUG_PREFIX, {
    debugTraceId,
    step,
    ...details,
  });
};

export const setBlobDebugTraceId = (blob: Blob, debugTraceId: string) => {
  blobDebugTraceIds.set(blob, debugTraceId);
};

export const getBlobDebugTraceId = (blob: Blob | null | undefined) => {
  if (!blob) {
    return undefined;
  }

  return blobDebugTraceIds.get(blob);
};

export const summarizeUrl = (value: string | null | undefined) => {
  if (!value) {
    return value;
  }

  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`;
  } catch {
    return value.slice(0, 160);
  }
};

export const getBlobDebugDetails = (blob: Blob | null | undefined) => {
  if (!blob) {
    return null;
  }

  return {
    size: blob.size,
    type: blob.type,
    debugTraceId: getBlobDebugTraceId(blob),
  };
};
