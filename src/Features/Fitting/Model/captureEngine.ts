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

export class DisplayMediaCaptureEngine implements CaptureEngine {
  async capture(): Promise<Blob> {
    throw new Error(
      'DisplayMediaCaptureEngine is reserved for phase 2 and is not implemented.',
    );
  }
}

type CaptureEngineKind = 'html2canvas' | 'display-media';

const DEFAULT_CAPTURE_ENGINE: CaptureEngineKind =
  import.meta.env.VITE_CAPTURE_ENGINE === 'display-media'
    ? 'display-media'
    : 'html2canvas';

type Html2CanvasCaptureEngineOptions = {
  convertImageToDataUrl: (imageUrl: string) => Promise<string>;
  setImageProcessing: (isProcessing: boolean) => void;
};

const isIntersectingRect = (
  source: DOMRect,
  target: { left: number; top: number; right: number; bottom: number },
) => {
  return !(
    source.right < target.left ||
    source.left > target.right ||
    source.bottom < target.top ||
    source.top > target.bottom
  );
};

const toImageBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('Failed to create image blob.'));
        return;
      }
      resolve(blob);
    });
  });

export class Html2CanvasCaptureEngine implements CaptureEngine {
  constructor(private readonly options: Html2CanvasCaptureEngineOptions) {}

  async capture(rect: CaptureRect): Promise<Blob> {
    const clampedRect = this.getClampedViewportRect(rect);
    const documentRect = {
      left: clampedRect.left + window.scrollX,
      top: clampedRect.top + window.scrollY,
      width: clampedRect.width,
      height: clampedRect.height,
    };

    const sourceImageRects = Array.from(document.querySelectorAll('img')).map(
      (img) => img.getBoundingClientRect(),
    );

    this.options.setImageProcessing(true);
    try {
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
        scale: window.devicePixelRatio || 1,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        x: documentRect.left,
        y: documentRect.top,
        width: documentRect.width,
        height: documentRect.height,
        onclone: async (cloneDoc) => {
          await this.convertTargetImagesToDataUrl(
            cloneDoc,
            sourceImageRects,
            clampedRect,
          );
        },
      });

      return await toImageBlob(canvas);
    } finally {
      this.options.setImageProcessing(false);
    }
  }

  private getClampedViewportRect(rect: CaptureRect): CaptureRect {
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
  }

  private async convertTargetImagesToDataUrl(
    cloneDoc: Document,
    sourceImageRects: DOMRect[],
    viewportRect: CaptureRect,
  ) {
    const failedImageUrls: string[] = [];
    const cloneImages = Array.from(cloneDoc.querySelectorAll('img'));
    const targetRect = {
      left: viewportRect.left,
      top: viewportRect.top,
      right: viewportRect.left + viewportRect.width,
      bottom: viewportRect.top + viewportRect.height,
    };

    for (let index = 0; index < cloneImages.length; index++) {
      const sourceRect = sourceImageRects[index];
      if (!sourceRect || !isIntersectingRect(sourceRect, targetRect)) {
        continue;
      }

      const cloneImage = cloneImages[index];
      const sourceUrl = cloneImage.currentSrc || cloneImage.src;

      if (!sourceUrl) {
        continue;
      }

      try {
        const dataUrl = await this.options.convertImageToDataUrl(sourceUrl);
        if (!dataUrl) {
          failedImageUrls.push(sourceUrl);
          continue;
        }
        cloneImage.src = dataUrl;
        cloneImage.srcset = '';
      } catch {
        failedImageUrls.push(sourceUrl);
      }
    }

    if (import.meta.env.DEV && failedImageUrls.length > 0) {
      console.warn('[capture] failed to convert image urls', {
        failedImageUrls,
      });
    }
  }
}

export const createCaptureEngine = (
  options: Html2CanvasCaptureEngineOptions,
): CaptureEngine => {
  if (DEFAULT_CAPTURE_ENGINE === 'display-media' && import.meta.env.DEV) {
    console.warn(
      '[capture] VITE_CAPTURE_ENGINE=display-media is not implemented in phase 1. Falling back to html2canvas.',
    );
  }

  return new Html2CanvasCaptureEngine(options);
};
