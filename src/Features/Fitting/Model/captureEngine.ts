import html2canvas from 'html2canvas-pro';

import { BASE_URL } from '@/Shared/Config';

import {
  captureDebugError,
  captureDebugInfo,
  captureDebugWarn,
  summarizeUrl,
} from './debug';

export type CaptureRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export interface CaptureEngine {
  capture(rect: CaptureRect, debugTraceId?: string): Promise<Blob>;
}

export type CaptureErrorCode =
  | 'CANVAS_LIMIT_EXCEEDED'
  | 'CORS_TAINT'
  | 'DISPLAY_MEDIA_DENIED'
  | 'DISPLAY_MEDIA_NOT_SUPPORTED'
  | 'EMPTY_IMAGE_BLOB'
  | 'UNKNOWN';

export class CaptureError extends Error {
  readonly code: CaptureErrorCode;
  readonly cause?: unknown;

  constructor(code: CaptureErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'CaptureError';
    this.code = code;
    this.cause = cause;
  }
}

type CaptureEngineKind = 'html2canvas' | 'display-media';

const IMAGE_PROXY_PATH = '/api/v1/try-on/image/proxy';
const DEFAULT_CAPTURE_ENGINE: CaptureEngineKind =
  import.meta.env.VITE_CAPTURE_ENGINE === 'display-media'
    ? 'display-media'
    : 'html2canvas';
const ENABLE_DISPLAY_MEDIA_FALLBACK =
  import.meta.env.VITE_CAPTURE_FALLBACK_DISPLAY_MEDIA !== 'false';
const MAX_CANVAS_EDGE_PX = 32767;
const MAX_CANVAS_AREA_PX = 268_435_456;

type Html2CanvasCaptureEngineOptions = {
  setImageProcessing: (isProcessing: boolean) => void;
  proxyUrl?: string;
  fallbackToDisplayMedia?: boolean;
};

export const getCaptureWindow = (): Window => {
  try {
    if (window.parent?.document?.body) {
      return window.parent as Window;
    }
  } catch {
    // Cross-origin parents are not readable. In that case, use the current document.
  }

  return window;
};

export const getDefaultImageProxyUrl = (): string => {
  if (!BASE_URL) {
    return IMAGE_PROXY_PATH;
  }

  return `${BASE_URL.replace(/\/$/, '')}${IMAGE_PROXY_PATH}`;
};

const isThatzfitElement = (element: Element): boolean => {
  const closest = element.closest?.(
    '#thatzfit-plugin, #thatzfit-entry, #thatzfit-iframe-wrapper, #thatzfit-iframe, #thatzfit-root, #thatzfit-plugin-wrapper, #thatzfit-plugin-entry-wrapper',
  );

  return closest !== null;
};

const isMediaResourceElement = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  return tagName === 'img' || tagName === 'image' || tagName === 'video';
};

const intersectsViewportRect = (
  element: Element,
  rect: CaptureRect,
): boolean => {
  const elementRect = element.getBoundingClientRect();

  if (elementRect.width <= 0 || elementRect.height <= 0) {
    return false;
  }

  return (
    elementRect.left < rect.left + rect.width &&
    elementRect.right > rect.left &&
    elementRect.top < rect.top + rect.height &&
    elementRect.bottom > rect.top
  );
};

const getImageSource = (image: HTMLImageElement): string | null => {
  const source = image.currentSrc || image.src;
  if (!source || source.startsWith('data:') || source.startsWith('blob:')) {
    return null;
  }

  return source;
};

const getSelectedExternalImageUrls = (
  captureDocument: Document,
  viewportRect: CaptureRect,
  captureWindow: Window,
): string[] => {
  const selectedUrls = new Set<string>();

  Array.from(captureDocument.images).forEach((image) => {
    if (
      isThatzfitElement(image) ||
      !intersectsViewportRect(image, viewportRect)
    ) {
      return;
    }

    const source = getImageSource(image);
    if (!source) {
      return;
    }

    const url = new URL(source, captureDocument.baseURI);
    if (url.origin !== captureWindow.location.origin) {
      selectedUrls.add(url.href);
    }
  });

  return Array.from(selectedUrls);
};

const createImageProxyRequestUrl = (
  proxyUrl: string,
  imageUrl: string,
  debugTraceId?: string,
): string => {
  const separator = proxyUrl.includes('?') ? '&' : '?';
  const traceQuery = debugTraceId
    ? `&debugTraceId=${encodeURIComponent(debugTraceId)}`
    : '';
  return `${proxyUrl}${separator}url=${encodeURIComponent(imageUrl)}&responseType=blob${traceQuery}`;
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
        return;
      }
      reject(
        new CaptureError(
          'CORS_TAINT',
          '외부 이미지 보안 정책으로 캡처에 실패했어요.',
        ),
      );
    });
    reader.addEventListener('error', () => reject(reader.error));
    reader.readAsDataURL(blob);
  });

const loadSelectedImageDataUrls = async (
  imageUrls: string[],
  proxyUrl: string,
  debugTraceId?: string,
): Promise<Map<string, string>> => {
  const dataUrls = new Map<string, string>();

  if (imageUrls.length === 0) {
    captureDebugInfo(debugTraceId, 'html2canvas.proxy.skip_no_external_images');
    return dataUrls;
  }

  captureDebugInfo(debugTraceId, 'html2canvas.proxy.batch_start', {
    proxyUrl: summarizeUrl(proxyUrl),
    imageCount: imageUrls.length,
    imageUrls: imageUrls.map(summarizeUrl),
  });

  const entries = await Promise.all(
    imageUrls.map(async (imageUrl) => {
      const requestUrl = createImageProxyRequestUrl(
        proxyUrl,
        imageUrl,
        debugTraceId,
      );
      captureDebugInfo(debugTraceId, 'html2canvas.proxy.fetch_start', {
        imageUrl: summarizeUrl(imageUrl),
        requestUrl: summarizeUrl(requestUrl),
      });

      const response = await fetch(requestUrl);

      if (!response.ok) {
        captureDebugWarn(debugTraceId, 'html2canvas.proxy.fetch_bad_status', {
          imageUrl: summarizeUrl(imageUrl),
          status: response.status,
          statusText: response.statusText,
        });
        throw new CaptureError(
          'CORS_TAINT',
          '외부 이미지 보안 정책으로 캡처에 실패했어요.',
        );
      }

      const contentType = response.headers.get('content-type') ?? '';
      if (!contentType.toLowerCase().startsWith('image/')) {
        captureDebugWarn(
          debugTraceId,
          'html2canvas.proxy.invalid_content_type',
          {
            imageUrl: summarizeUrl(imageUrl),
            contentType,
          },
        );
        throw new CaptureError(
          'CORS_TAINT',
          '외부 이미지 보안 정책으로 캡처에 실패했어요.',
        );
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        captureDebugWarn(debugTraceId, 'html2canvas.proxy.empty_blob', {
          imageUrl: summarizeUrl(imageUrl),
          contentType,
        });
        throw new CaptureError(
          'CORS_TAINT',
          '외부 이미지 보안 정책으로 캡처에 실패했어요.',
        );
      }

      captureDebugInfo(debugTraceId, 'html2canvas.proxy.fetch_success', {
        imageUrl: summarizeUrl(imageUrl),
        contentType,
        blobSize: blob.size,
      });

      return [imageUrl, await blobToDataUrl(blob)] as const;
    }),
  );

  entries.forEach(([imageUrl, dataUrl]) => {
    dataUrls.set(imageUrl, dataUrl);
  });

  captureDebugInfo(debugTraceId, 'html2canvas.proxy.batch_success', {
    dataUrlCount: dataUrls.size,
  });

  return dataUrls;
};

const inlineSelectedExternalImages = (
  clonedDocument: Document,
  imageDataUrls: Map<string, string>,
): void => {
  if (imageDataUrls.size === 0) {
    return;
  }

  Array.from(clonedDocument.images).forEach((image) => {
    const source = getImageSource(image);
    if (!source) {
      return;
    }

    const dataUrl = imageDataUrls.get(
      new URL(source, clonedDocument.baseURI).href,
    );
    if (!dataUrl) {
      return;
    }

    image.removeAttribute('srcset');
    image.src = dataUrl;
  });
};

const createCaptureIgnoreElements =
  (viewportRect: CaptureRect) =>
  (element: Element): boolean => {
    if (isThatzfitElement(element)) {
      return true;
    }

    return (
      isMediaResourceElement(element) &&
      !intersectsViewportRect(element, viewportRect)
    );
  };

const getViewportPointElementStack = (
  captureDocument: Document,
  x: number,
  y: number,
) =>
  captureDocument
    .elementsFromPoint(x, y)
    .slice(0, 8)
    .map((element) => {
      const rect = element.getBoundingClientRect();

      return {
        tagName: element.tagName,
        id: element.id || undefined,
        className:
          typeof element.className === 'string' ? element.className : undefined,
        rect: {
          top: Math.round(rect.top),
          left: Math.round(rect.left),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom),
        },
      };
    });

const toImageBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(
            new CaptureError(
              'EMPTY_IMAGE_BLOB',
              '캡처 이미지를 생성할 수 없어요.',
            ),
          );
          return;
        }
        resolve(blob);
      });
    } catch (error) {
      reject(toCaptureError(error));
    }
  });

const roundRatio = (value: number) => Math.round(value * 10000) / 10000;

const getCanvasPixelSample = (canvas: HTMLCanvasElement) => {
  const columns = Math.min(32, Math.max(canvas.width, 1));
  const rows = Math.min(32, Math.max(canvas.height, 1));
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = columns;
  sampleCanvas.height = rows;

  const sampleContext = sampleCanvas.getContext('2d', {
    willReadFrequently: true,
  });
  if (!sampleContext) {
    return {
      sampleUnavailableReason: 'missing_sample_2d_context',
    };
  }

  sampleContext.drawImage(canvas, 0, 0, columns, rows);
  const pixels = sampleContext.getImageData(0, 0, columns, rows).data;
  const sampleCount = columns * rows;
  let transparentCount = 0;
  let nearWhiteCount = 0;
  let nearBlackCount = 0;
  let alphaTotal = 0;
  let redTotal = 0;
  let greenTotal = 0;
  let blueTotal = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const pixelIndex = (row * columns + column) * 4;
      const red = pixels[pixelIndex] ?? 0;
      const green = pixels[pixelIndex + 1] ?? 0;
      const blue = pixels[pixelIndex + 2] ?? 0;
      const alpha = pixels[pixelIndex + 3] ?? 0;

      redTotal += red;
      greenTotal += green;
      blueTotal += blue;
      alphaTotal += alpha;

      if (alpha <= 5) {
        transparentCount += 1;
      }
      if (alpha > 5 && red >= 245 && green >= 245 && blue >= 245) {
        nearWhiteCount += 1;
      }
      if (alpha > 5 && red <= 10 && green <= 10 && blue <= 10) {
        nearBlackCount += 1;
      }
    }
  }

  const transparentRatio = transparentCount / sampleCount;
  const nearWhiteRatio = nearWhiteCount / sampleCount;
  const nearBlackRatio = nearBlackCount / sampleCount;

  return {
    sampleCount,
    transparentRatio: roundRatio(transparentRatio),
    nearWhiteRatio: roundRatio(nearWhiteRatio),
    nearBlackRatio: roundRatio(nearBlackRatio),
    averageAlpha: Math.round(alphaTotal / sampleCount),
    averageRgb: {
      red: Math.round(redTotal / sampleCount),
      green: Math.round(greenTotal / sampleCount),
      blue: Math.round(blueTotal / sampleCount),
    },
    isLikelyBlank:
      transparentRatio >= 0.98 ||
      nearWhiteRatio >= 0.98 ||
      nearBlackRatio >= 0.98,
  };
};

const waitForVideoReady = (video: HTMLVideoElement) =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(
        new CaptureError('UNKNOWN', '화면 공유 준비 시간이 초과되었어요.'),
      );
    }, 7000);

    const handleLoadedMetadata = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    const handleError = () => {
      window.clearTimeout(timeout);
      reject(
        new CaptureError('UNKNOWN', '화면 공유 영상을 불러오지 못했어요.'),
      );
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata, {
      once: true,
    });
    video.addEventListener('error', handleError, {
      once: true,
    });
  });

const getClampedViewportRect = (
  rect: CaptureRect,
  viewportWindow = getCaptureWindow(),
): CaptureRect => {
  const viewportWidth = Math.max(viewportWindow.innerWidth, 1);
  const viewportHeight = Math.max(viewportWindow.innerHeight, 1);

  const left = Math.max(0, Math.min(rect.left, viewportWidth - 1));
  const top = Math.max(0, Math.min(rect.top, viewportHeight - 1));
  const right = Math.max(
    left + 1,
    Math.min(rect.left + rect.width, viewportWidth),
  );
  const bottom = Math.max(
    top + 1,
    Math.min(rect.top + rect.height, viewportHeight),
  );

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(right - left),
    height: Math.round(bottom - top),
  };
};

const assertCanvasLimit = (
  width: number,
  height: number,
  scale: number,
): void => {
  const scaledWidth = Math.max(1, Math.round(width * scale));
  const scaledHeight = Math.max(1, Math.round(height * scale));
  const area = scaledWidth * scaledHeight;

  if (
    scaledWidth > MAX_CANVAS_EDGE_PX ||
    scaledHeight > MAX_CANVAS_EDGE_PX ||
    area > MAX_CANVAS_AREA_PX
  ) {
    throw new CaptureError(
      'CANVAS_LIMIT_EXCEEDED',
      '선택한 영역이 브라우저 캔버스 한도를 초과했어요. 영역을 더 작게 선택해 주세요.',
    );
  }
};

const toCaptureError = (error: unknown): CaptureError => {
  if (error instanceof CaptureError) {
    return error;
  }
  if (error instanceof DOMException) {
    if (
      error.name === 'NotAllowedError' ||
      error.name === 'AbortError' ||
      error.name === 'SecurityError'
    ) {
      return new CaptureError(
        'DISPLAY_MEDIA_DENIED',
        '화면 공유 권한이 필요해요. 권한을 허용한 뒤 다시 시도해 주세요.',
        error,
      );
    }
    if (error.name === 'NotFoundError' || error.name === 'NotSupportedError') {
      return new CaptureError(
        'DISPLAY_MEDIA_NOT_SUPPORTED',
        '브라우저에서 화면 캡처를 지원하지 않아요.',
        error,
      );
    }
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('tainted') || message.includes('cross-origin')) {
      return new CaptureError(
        'CORS_TAINT',
        '외부 이미지 보안 정책으로 캡처에 실패했어요.',
        error,
      );
    }
    return new CaptureError('UNKNOWN', error.message, error);
  }

  return new CaptureError(
    'UNKNOWN',
    '캡처 중 알 수 없는 오류가 발생했어요.',
    error,
  );
};

export class DisplayMediaCaptureEngine implements CaptureEngine {
  private readonly options: Pick<
    Html2CanvasCaptureEngineOptions,
    'setImageProcessing'
  >;

  constructor(
    options: Pick<Html2CanvasCaptureEngineOptions, 'setImageProcessing'>,
  ) {
    this.options = options;
  }

  async capture(rect: CaptureRect, debugTraceId?: string): Promise<Blob> {
    const captureWindow = getCaptureWindow();
    const clampedRect = getClampedViewportRect(rect, captureWindow);
    captureDebugInfo(debugTraceId, 'display_media.capture_start', {
      requestedRect: rect,
      clampedRect,
      viewport: {
        width: captureWindow.innerWidth,
        height: captureWindow.innerHeight,
      },
      hasGetDisplayMedia: Boolean(navigator.mediaDevices?.getDisplayMedia),
    });

    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new CaptureError(
        'DISPLAY_MEDIA_NOT_SUPPORTED',
        '브라우저에서 화면 캡처를 지원하지 않아요.',
      );
    }

    let stream: MediaStream | null = null;
    this.options.setImageProcessing(true);
    try {
      captureDebugInfo(debugTraceId, 'display_media.permission_prompt_start');
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          // TS lib에 없는 옵션이라 확장 타입으로 전달한다.
          ...({ preferCurrentTab: true } as MediaTrackConstraints),
        },
        audio: false,
      });
      captureDebugInfo(debugTraceId, 'display_media.stream_acquired', {
        trackCount: stream.getTracks().length,
        videoTrackCount: stream.getVideoTracks().length,
      });

      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;

      await waitForVideoReady(video);
      await video.play();
      captureDebugInfo(debugTraceId, 'display_media.video_ready', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });

      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = video.videoWidth;
      sourceCanvas.height = video.videoHeight;
      const sourceContext = sourceCanvas.getContext('2d');
      if (!sourceContext) {
        throw new CaptureError(
          'UNKNOWN',
          '화면 캡처 컨텍스트를 만들 수 없어요.',
        );
      }
      sourceContext.drawImage(video, 0, 0);

      const scaleX = sourceCanvas.width / Math.max(captureWindow.innerWidth, 1);
      const scaleY =
        sourceCanvas.height / Math.max(captureWindow.innerHeight, 1);
      const sx = Math.max(0, Math.round(clampedRect.left * scaleX));
      const sy = Math.max(0, Math.round(clampedRect.top * scaleY));
      const sWidth = Math.max(1, Math.round(clampedRect.width * scaleX));
      const sHeight = Math.max(1, Math.round(clampedRect.height * scaleY));

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = Math.min(sWidth, sourceCanvas.width - sx);
      cropCanvas.height = Math.min(sHeight, sourceCanvas.height - sy);
      captureDebugInfo(debugTraceId, 'display_media.crop_canvas_ready', {
        sourceCanvas: {
          width: sourceCanvas.width,
          height: sourceCanvas.height,
        },
        crop: { sx, sy, sWidth, sHeight },
        cropCanvas: {
          width: cropCanvas.width,
          height: cropCanvas.height,
        },
      });
      const cropContext = cropCanvas.getContext('2d');
      if (!cropContext) {
        throw new CaptureError(
          'UNKNOWN',
          '잘라내기 컨텍스트를 만들 수 없어요.',
        );
      }

      cropContext.drawImage(
        sourceCanvas,
        sx,
        sy,
        cropCanvas.width,
        cropCanvas.height,
        0,
        0,
        cropCanvas.width,
        cropCanvas.height,
      );

      const blob = await toImageBlob(cropCanvas);
      captureDebugInfo(debugTraceId, 'display_media.capture_success', {
        blobSize: blob.size,
        blobType: blob.type,
      });
      return blob;
    } catch (error) {
      captureDebugError(debugTraceId, 'display_media.capture_failed', {
        error,
      });
      throw toCaptureError(error);
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
      this.options.setImageProcessing(false);
      captureDebugInfo(debugTraceId, 'display_media.capture_cleanup');
    }
  }
}

export class Html2CanvasCaptureEngine implements CaptureEngine {
  private readonly options: Html2CanvasCaptureEngineOptions;

  constructor(options: Html2CanvasCaptureEngineOptions) {
    this.options = options;
  }

  async capture(rect: CaptureRect, debugTraceId?: string): Promise<Blob> {
    const proxyUrl = this.options.proxyUrl ?? getDefaultImageProxyUrl();
    const captureWindow = getCaptureWindow();
    const captureDocument = captureWindow.document;
    const clampedRect = getClampedViewportRect(rect, captureWindow);
    const documentRect = {
      left: clampedRect.left + captureWindow.scrollX,
      top: clampedRect.top + captureWindow.scrollY,
      width: clampedRect.width,
      height: clampedRect.height,
    };
    const scale = captureWindow.devicePixelRatio || 1;

    captureDebugInfo(debugTraceId, 'html2canvas.capture_start', {
      requestedRect: rect,
      clampedRect,
      documentRect,
      rectCenterStack: getViewportPointElementStack(
        captureDocument,
        Math.round(clampedRect.left + clampedRect.width / 2),
        Math.round(clampedRect.top + clampedRect.height / 2),
      ),
      scale,
      proxyUrl: summarizeUrl(proxyUrl),
      captureWindowLocation: summarizeUrl(captureWindow.location.href),
      documentBaseUri: summarizeUrl(captureDocument.baseURI),
      viewport: {
        width: captureWindow.innerWidth,
        height: captureWindow.innerHeight,
        scrollX: captureWindow.scrollX,
        scrollY: captureWindow.scrollY,
      },
      documentSize: {
        width: Math.max(
          captureDocument.documentElement.scrollWidth,
          captureDocument.body.scrollWidth,
          captureWindow.innerWidth,
        ),
        height: Math.max(
          captureDocument.documentElement.scrollHeight,
          captureDocument.body.scrollHeight,
          captureWindow.innerHeight,
        ),
      },
    });

    this.options.setImageProcessing(true);
    try {
      assertCanvasLimit(documentRect.width, documentRect.height, scale);
      captureDebugInfo(debugTraceId, 'html2canvas.canvas_limit_passed');
      const selectedExternalImageUrls = getSelectedExternalImageUrls(
        captureDocument,
        clampedRect,
        captureWindow,
      );
      captureDebugInfo(debugTraceId, 'html2canvas.external_images_selected', {
        imageCount: selectedExternalImageUrls.length,
        imageUrls: selectedExternalImageUrls.map(summarizeUrl),
      });
      const imageDataUrls = await loadSelectedImageDataUrls(
        selectedExternalImageUrls,
        proxyUrl,
        debugTraceId,
      );

      captureDebugInfo(debugTraceId, 'html2canvas.render_start', {
        inlinedImageCount: imageDataUrls.size,
      });
      const canvas = await html2canvas(captureDocument.body, {
        allowTaint: false,
        useCORS: false,
        proxy: proxyUrl,
        backgroundColor: null,
        ignoreElements: createCaptureIgnoreElements(clampedRect),
        onclone: (clonedDocument) => {
          inlineSelectedExternalImages(clonedDocument, imageDataUrls);
        },
        logging: import.meta.env.DEV,
        scale,
        scrollX: 0,
        scrollY: 0,
        x: documentRect.left,
        y: documentRect.top,
        width: documentRect.width,
        height: documentRect.height,
        windowWidth: Math.max(
          captureDocument.documentElement.scrollWidth,
          captureDocument.body.scrollWidth,
          captureWindow.innerWidth,
        ),
        windowHeight: Math.max(
          captureDocument.documentElement.scrollHeight,
          captureDocument.body.scrollHeight,
          captureWindow.innerHeight,
        ),
      });
      captureDebugInfo(debugTraceId, 'html2canvas.render_success', {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      });
      try {
        captureDebugInfo(
          debugTraceId,
          'html2canvas.canvas_pixel_sample',
          getCanvasPixelSample(canvas),
        );
      } catch (error) {
        captureDebugWarn(
          debugTraceId,
          'html2canvas.canvas_pixel_sample_failed',
          {
            error,
          },
        );
      }

      try {
        canvas.toDataURL('image/png');
        captureDebugInfo(debugTraceId, 'html2canvas.to_data_url_success');
      } catch (error) {
        captureDebugWarn(debugTraceId, 'html2canvas.to_data_url_failed', {
          error,
        });
        throw new CaptureError(
          'CORS_TAINT',
          '외부 이미지 보안 정책으로 캡처에 실패했어요.',
          error,
        );
      }

      const blob = await toImageBlob(canvas);
      captureDebugInfo(debugTraceId, 'html2canvas.to_blob_success', {
        blobSize: blob.size,
        blobType: blob.type,
      });
      return blob;
    } catch (error) {
      captureDebugError(debugTraceId, 'html2canvas.capture_failed', {
        error,
      });
      throw toCaptureError(error);
    } finally {
      this.options.setImageProcessing(false);
      captureDebugInfo(debugTraceId, 'html2canvas.capture_cleanup');
    }
  }
}

class FallbackCaptureEngine implements CaptureEngine {
  private readonly primary: CaptureEngine;
  private readonly fallback: CaptureEngine;
  private readonly enabled: boolean;

  constructor(
    primary: CaptureEngine,
    fallback: CaptureEngine,
    enabled: boolean,
  ) {
    this.primary = primary;
    this.fallback = fallback;
    this.enabled = enabled;
  }

  async capture(rect: CaptureRect, debugTraceId?: string): Promise<Blob> {
    try {
      captureDebugInfo(debugTraceId, 'fallback.primary_start', {
        enabled: this.enabled,
      });
      const blob = await this.primary.capture(rect, debugTraceId);
      captureDebugInfo(debugTraceId, 'fallback.primary_success');
      return blob;
    } catch (error) {
      const captureError = toCaptureError(error);
      if (!this.enabled) {
        captureDebugWarn(debugTraceId, 'fallback.disabled', {
          code: captureError.code,
          message: captureError.message,
        });
        throw captureError;
      }

      if (
        captureError.code !== 'CORS_TAINT' &&
        captureError.code !== 'EMPTY_IMAGE_BLOB' &&
        captureError.code !== 'UNKNOWN'
      ) {
        captureDebugWarn(debugTraceId, 'fallback.not_allowed_for_error', {
          code: captureError.code,
          message: captureError.message,
        });
        throw captureError;
      }

      captureDebugWarn(debugTraceId, 'fallback.display_media_start', {
        code: captureError.code,
        message: captureError.message,
      });

      return this.fallback.capture(rect, debugTraceId);
    }
  }
}

export const createCaptureEngine = (
  options: Html2CanvasCaptureEngineOptions,
): CaptureEngine => {
  const displayMediaEngine = new DisplayMediaCaptureEngine({
    setImageProcessing: options.setImageProcessing,
  });
  if (DEFAULT_CAPTURE_ENGINE === 'display-media') {
    return displayMediaEngine;
  }

  const htmlEngine = new Html2CanvasCaptureEngine(options);
  return new FallbackCaptureEngine(
    htmlEngine,
    displayMediaEngine,
    options.fallbackToDisplayMedia ?? ENABLE_DISPLAY_MEDIA_FALLBACK,
  );
};
