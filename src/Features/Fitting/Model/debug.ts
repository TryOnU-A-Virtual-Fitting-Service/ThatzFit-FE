const DEBUG_PREFIX = '[ThatzFit-FE][capture-debug]';
const blobDebugTraceIds = new WeakMap<Blob, string>();

type DebugDetails = Record<string, unknown>;

export const createCaptureDebugTraceId = () =>
  `tf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const captureDebugInfo = (
  debugTraceId: string | undefined,
  step: string,
  details: DebugDetails = {},
) => {
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
