import { getDefaultImageProxyUrl } from './captureEngine';

export const MOBILE_PRODUCT_TRY_ON_REQUEST_EVENT =
  'thatzfit:mobile-product-try-on-request';
export const MOBILE_PRODUCT_TRY_ON_STATE_EVENT =
  'thatzfit:mobile-product-try-on-state';

const MOBILE_PRODUCT_TRY_ON_CONTRACT_VERSION = 1;
const MAX_URL_LENGTH = 2048;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const REQUEST_ID_PATTERN = /^[a-zA-Z0-9_-]{1,128}$/;

export type MobileProductTryOnRequest = {
  version: 1;
  requestId: string;
  imageUrl: string;
  source: 'mobile_product_tag';
};

const normalizeHttpUrl = (value: unknown): string | null => {
  if (
    typeof value !== 'string' ||
    value.length === 0 ||
    value.length > MAX_URL_LENGTH
  ) {
    return null;
  }

  try {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.href;
  } catch {
    return null;
  }
};

export const parseMobileProductTryOnRequest = (
  value: unknown,
): MobileProductTryOnRequest | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const detail = value as Record<string, unknown>;
  const imageUrl = normalizeHttpUrl(detail.imageUrl);
  if (
    detail.version !== MOBILE_PRODUCT_TRY_ON_CONTRACT_VERSION ||
    detail.source !== 'mobile_product_tag' ||
    typeof detail.requestId !== 'string' ||
    !REQUEST_ID_PATTERN.test(detail.requestId) ||
    !imageUrl
  ) {
    return null;
  }

  return {
    version: 1,
    requestId: detail.requestId,
    imageUrl,
    source: 'mobile_product_tag',
  };
};

export const buildMobileProductImageProxyUrl = (
  imageUrl: string,
  debugTraceId: string,
) => {
  const proxyUrl = getDefaultImageProxyUrl();
  const separator = proxyUrl.includes('?') ? '&' : '?';
  return `${proxyUrl}${separator}url=${encodeURIComponent(imageUrl)}&responseType=blob&debugTraceId=${encodeURIComponent(debugTraceId)}`;
};

export const fetchMobileProductImageBlob = async (
  imageUrl: string,
  debugTraceId: string,
  signal: AbortSignal,
) => {
  const response = await fetch(
    buildMobileProductImageProxyUrl(imageUrl, debugTraceId),
    { signal },
  );
  if (!response.ok) {
    throw new Error(
      `Product image proxy failed with status ${response.status}`,
    );
  }

  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.startsWith('image/')) {
    throw new Error('Product image proxy returned non-image content');
  }

  const blob = await response.blob();
  if (blob.size === 0 || blob.size > MAX_IMAGE_BYTES) {
    throw new Error('Product image proxy returned an invalid image size');
  }

  return blob;
};
