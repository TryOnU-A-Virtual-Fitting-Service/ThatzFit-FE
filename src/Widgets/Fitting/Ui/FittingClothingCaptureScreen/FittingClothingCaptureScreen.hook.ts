import {
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  getCaptureWindow,
  getDefaultImageProxyUrl,
} from '@/Features/Fitting/Model/captureEngine';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

import { useToast } from '@/Shared/Model';

const ACTIVE_CAPTURE_SELECTOR = 'img[data-thatzfit-active-capture="true"]';
const MAX_CROPPED_IMAGE_EDGE = 1600;
const CROPPED_IMAGE_TYPE = 'image/jpeg';
const CROPPED_IMAGE_QUALITY = 0.9;

type CropRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const createImageProxyRequestUrl = (
  proxyUrl: string,
  imageUrl: string,
): string => {
  const separator = proxyUrl.includes('?') ? '&' : '?';
  return `${proxyUrl}${separator}url=${encodeURIComponent(imageUrl)}&responseType=blob`;
};

const getActiveCaptureImage = (): HTMLImageElement | null => {
  return getCaptureWindow().document.querySelector<HTMLImageElement>(
    ACTIVE_CAPTURE_SELECTOR,
  );
};

const getImageSource = (image: HTMLImageElement): string | null => {
  return image.currentSrc || image.src || null;
};

const fetchProxiedImageBlob = async (source: string): Promise<Blob> => {
  const proxyUrl = getDefaultImageProxyUrl();
  const response = await fetch(createImageProxyRequestUrl(proxyUrl, source));

  if (!response.ok) {
    throw new Error(`Image proxy failed with ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('image/')) {
    throw new Error(`Unsupported proxied content type: ${contentType}`);
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error('Proxied image is empty');
  }

  return blob;
};

const toImageBlob = (
  canvas: HTMLCanvasElement,
  type = CROPPED_IMAGE_TYPE,
  quality = CROPPED_IMAGE_QUALITY,
) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create cropped image'));
          return;
        }
        resolve(blob);
      },
      type,
      quality,
    );
  });

export const useCroppedClothing = () => {
  const {
    isCapturing,
    setIsCapturing,
    setCapturedClothingImage,
    setIsFittingDialogOpen,
    setIsImageProcessing,
  } = useFittingStore(
    useShallow((state) => ({
      isCapturing: state.isCapturing,
      setIsCapturing: state.setIsCapturing,
      setCapturedClothingImage: state.setCapturedClothingImage,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
      setIsImageProcessing: state.setIsImageProcessing,
    })),
  );

  const { pluginWrapper, setIsPluginOpen } = usePluginStore(
    useShallow((state) => ({
      pluginWrapper: state.pluginWrapper,
      setIsPluginOpen: state.setIsPluginOpen,
    })),
  );

  const { toast } = useToast();
  const toastRef = useRef(toast);
  const imageRef = useRef<HTMLImageElement>(null);
  const cropStartRef = useRef<{ x: number; y: number } | null>(null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);
  const [selection, setSelection] = useState<CropRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const clearActiveCaptureImages = useCallback(() => {
    getCaptureWindow()
      .document.querySelectorAll(ACTIVE_CAPTURE_SELECTOR)
      .forEach((element) => {
        element.removeAttribute('data-thatzfit-active-capture');
      });
  }, []);

  const restorePluginVisibility = useCallback(() => {
    if (!pluginWrapper) {
      return;
    }
    setIsPluginOpen(true);
    pluginWrapper.classList.toggle('thatzfit-visible', true);
    pluginWrapper.classList.toggle('thatzfit-hidden', false);
  }, [pluginWrapper, setIsPluginOpen]);

  const finishCaptureMode = useCallback(() => {
    cropStartRef.current = null;
    setSelection(null);
    setIsDragging(false);
    setIsCapturing(false);
    setIsImageProcessing(false);
    clearActiveCaptureImages();
    restorePluginVisibility();
  }, [
    clearActiveCaptureImages,
    restorePluginVisibility,
    setIsCapturing,
    setIsImageProcessing,
  ]);

  const cancelCapture = useCallback(() => {
    setIsFittingDialogOpen(false);
    setCapturedClothingImage(null);
    finishCaptureMode();
  }, [finishCaptureMode, setCapturedClothingImage, setIsFittingDialogOpen]);

  useEffect(() => {
    if (!isCapturing) {
      return;
    }

    let isMounted = true;
    let objectUrl: string | null = null;

    const loadActiveImage = async () => {
      const activeImage = getActiveCaptureImage();
      const source = activeImage ? getImageSource(activeImage) : null;
      if (!source) {
        toastRef.current.error('입어볼 옷 이미지를 찾지 못했어요.');
        finishCaptureMode();
        return;
      }

      setIsLoadingImage(true);
      setIsImageProcessing(true);
      try {
        const imageBlob = await fetchProxiedImageBlob(source);
        objectUrl = URL.createObjectURL(imageBlob);
        if (isMounted) {
          setCropImageUrl(objectUrl);
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn('[capture] image proxy failed', error);
        }
        toastRef.current.error(
          '옷 이미지를 불러오지 못했어요. 다시 시도해 주세요.',
        );
        finishCaptureMode();
      } finally {
        if (isMounted) {
          setIsLoadingImage(false);
          setIsImageProcessing(false);
        }
      }
    };

    void loadActiveImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setCropImageUrl(null);
    };
  }, [finishCaptureMode, isCapturing, setIsImageProcessing]);

  const getImageLocalPoint = (event: MouseEvent): { x: number; y: number } => {
    const image = imageRef.current;
    if (!image) {
      return { x: 0, y: 0 };
    }

    const rect = image.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(event.clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(event.clientY - rect.top, rect.height)),
    };
  };

  const updateSelection = (event: MouseEvent) => {
    const start = cropStartRef.current;
    if (!start) {
      return;
    }

    const point = getImageLocalPoint(event);
    const left = Math.min(start.x, point.x);
    const top = Math.min(start.y, point.y);
    const right = Math.max(start.x, point.x);
    const bottom = Math.max(start.y, point.y);

    setSelection({
      left,
      top,
      width: right - left,
      height: bottom - top,
    });
  };

  const handleCropStart = (event: MouseEvent) => {
    event.preventDefault();
    const point = getImageLocalPoint(event);
    cropStartRef.current = point;
    setSelection({ left: point.x, top: point.y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const handleCropMove = (event: MouseEvent) => {
    if (!isDragging) {
      return;
    }
    updateSelection(event);
  };

  const handleCropEnd = (event: MouseEvent) => {
    if (!isDragging) {
      return;
    }
    updateSelection(event);
    setIsDragging(false);
    cropStartRef.current = null;
  };

  const cropSelectedImage = async () => {
    const image = imageRef.current;
    if (!image || !selection || selection.width < 4 || selection.height < 4) {
      toast.error('옷 영역을 드래그해서 선택해 주세요.');
      return;
    }

    const imageRect = image.getBoundingClientRect();
    const sourceLeft = Math.round(
      (selection.left / imageRect.width) * image.naturalWidth,
    );
    const sourceTop = Math.round(
      (selection.top / imageRect.height) * image.naturalHeight,
    );
    const sourceWidth = Math.round(
      (selection.width / imageRect.width) * image.naturalWidth,
    );
    const sourceHeight = Math.round(
      (selection.height / imageRect.height) * image.naturalHeight,
    );
    const scale = Math.min(
      1,
      MAX_CROPPED_IMAGE_EDGE / Math.max(sourceWidth, sourceHeight),
    );
    const outputWidth = Math.max(1, Math.round(sourceWidth * scale));
    const outputHeight = Math.max(1, Math.round(sourceHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext('2d');
    if (!context) {
      toast.error('캡처 이미지를 만들지 못했어요. 다시 시도해 주세요.');
      return;
    }

    setIsImageProcessing(true);
    try {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, outputWidth, outputHeight);
      context.drawImage(
        image,
        sourceLeft,
        sourceTop,
        sourceWidth,
        sourceHeight,
        0,
        0,
        outputWidth,
        outputHeight,
      );
      const croppedBlob = await toImageBlob(canvas);
      setCapturedClothingImage(croppedBlob);
      setIsFittingDialogOpen(true);
      finishCaptureMode();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[capture] crop failed', error);
      }
      toast.error('옷 캡처에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsImageProcessing(false);
    }
  };

  const handleCancelCapture = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cancelCapture();
    }
  };

  return {
    cropImageUrl,
    imageRef,
    selection,
    isDragging,
    isLoadingImage,
    handleCropStart,
    handleCropMove,
    handleCropEnd,
    handleCancelCapture,
    cancelCapture,
    cropSelectedImage,
  };
};
