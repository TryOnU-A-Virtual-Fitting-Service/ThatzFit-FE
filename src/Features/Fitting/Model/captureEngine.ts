import html2canvas from 'html2canvas-pro';

export type CaptureRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export interface CaptureEngine {
  capture(rect: CaptureRect): Promise<Blob>;
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

const getClampedViewportRect = (rect: CaptureRect): CaptureRect => {
  const viewportWidth = Math.max(window.innerWidth, 1);
  const viewportHeight = Math.max(window.innerHeight, 1);

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

  async capture(rect: CaptureRect): Promise<Blob> {
    const clampedRect = getClampedViewportRect(rect);
    if (!navigator.mediaDevices?.getDisplayMedia) {
      throw new CaptureError(
        'DISPLAY_MEDIA_NOT_SUPPORTED',
        '브라우저에서 화면 캡처를 지원하지 않아요.',
      );
    }

    let stream: MediaStream | null = null;
    this.options.setImageProcessing(true);
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'browser',
          // TS lib에 없는 옵션이라 확장 타입으로 전달한다.
          ...({ preferCurrentTab: true } as MediaTrackConstraints),
        },
        audio: false,
      });

      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.srcObject = stream;

      await waitForVideoReady(video);
      await video.play();

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

      const scaleX = sourceCanvas.width / Math.max(window.innerWidth, 1);
      const scaleY = sourceCanvas.height / Math.max(window.innerHeight, 1);
      const sx = Math.max(0, Math.round(clampedRect.left * scaleX));
      const sy = Math.max(0, Math.round(clampedRect.top * scaleY));
      const sWidth = Math.max(1, Math.round(clampedRect.width * scaleX));
      const sHeight = Math.max(1, Math.round(clampedRect.height * scaleY));

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = Math.min(sWidth, sourceCanvas.width - sx);
      cropCanvas.height = Math.min(sHeight, sourceCanvas.height - sy);
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

      return await toImageBlob(cropCanvas);
    } catch (error) {
      throw toCaptureError(error);
    } finally {
      stream?.getTracks().forEach((track) => track.stop());
      this.options.setImageProcessing(false);
    }
  }
}

export class Html2CanvasCaptureEngine implements CaptureEngine {
  private readonly options: Html2CanvasCaptureEngineOptions;

  constructor(options: Html2CanvasCaptureEngineOptions) {
    this.options = options;
  }

  async capture(rect: CaptureRect): Promise<Blob> {
    const proxyUrl = this.options.proxyUrl ?? '/api/v1/try-on/image/proxy';
    const clampedRect = getClampedViewportRect(rect);
    const documentRect = {
      left: clampedRect.left + window.scrollX,
      top: clampedRect.top + window.scrollY,
      width: clampedRect.width,
      height: clampedRect.height,
    };
    const scale = window.devicePixelRatio || 1;

    this.options.setImageProcessing(true);
    try {
      assertCanvasLimit(documentRect.width, documentRect.height, scale);

      const canvas = await html2canvas(document.body, {
        allowTaint: false,
        useCORS: false,
        proxy: proxyUrl,
        backgroundColor: null,
        scale,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        x: documentRect.left,
        y: documentRect.top,
        width: documentRect.width,
        height: documentRect.height,
        windowWidth: Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth,
          window.innerWidth,
        ),
        windowHeight: Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
          window.innerHeight,
        ),
      });

      try {
        canvas.toDataURL('image/png');
      } catch (error) {
        throw new CaptureError(
          'CORS_TAINT',
          '외부 이미지 보안 정책으로 캡처에 실패했어요.',
          error,
        );
      }

      return await toImageBlob(canvas);
    } catch (error) {
      throw toCaptureError(error);
    } finally {
      this.options.setImageProcessing(false);
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

  async capture(rect: CaptureRect): Promise<Blob> {
    try {
      return await this.primary.capture(rect);
    } catch (error) {
      const captureError = toCaptureError(error);
      if (!this.enabled) {
        throw captureError;
      }

      if (
        captureError.code !== 'CORS_TAINT' &&
        captureError.code !== 'EMPTY_IMAGE_BLOB' &&
        captureError.code !== 'UNKNOWN'
      ) {
        throw captureError;
      }

      if (import.meta.env.DEV) {
        console.warn(
          '[capture] html2canvas failed. trying display-media fallback.',
          {
            code: captureError.code,
            message: captureError.message,
          },
        );
      }

      return this.fallback.capture(rect);
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
