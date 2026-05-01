import {
  type KeyboardEvent,
  type MouseEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  CaptureError,
  type CaptureRect,
  createCaptureEngine,
} from '@/Features/Fitting/Model/captureEngine';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

import { useToast } from '@/Shared/Model';

const getCaptureErrorMessage = (error: unknown): string => {
  if (!(error instanceof CaptureError)) {
    return '옷 캡처에 실패했어요.';
  }

  switch (error.code) {
    case 'CANVAS_LIMIT_EXCEEDED':
      return '선택 영역이 너무 커서 캡처할 수 없어요. 영역을 조금 줄여주세요.';
    case 'CORS_TAINT':
      return '외부 이미지 보안 정책으로 캡처에 실패했어요. 다시 시도해 주세요.';
    case 'DISPLAY_MEDIA_DENIED':
      return '화면 공유 권한을 허용해 주세요. 권한 허용 후 다시 시도해 주세요.';
    case 'DISPLAY_MEDIA_NOT_SUPPORTED':
      return '현재 브라우저에서 화면 공유 캡처를 지원하지 않아요.';
    case 'EMPTY_IMAGE_BLOB':
      return '캡처 이미지 생성에 실패했어요. 다시 시도해 주세요.';
    default:
      return '옷 캡처에 실패했어요.';
  }
};

export const useCroppedClothing = () => {
  const { setIsCapturing, setCapturedClothingImage, setIsFittingDialogOpen } =
    useFittingStore(
      useShallow((state) => ({
        isCapturing: state.isCapturing,
        setIsCapturing: state.setIsCapturing,
        setCapturedClothingImage: state.setCapturedClothingImage,
        setIsFittingDialogOpen: state.setIsFittingDialogOpen,
      })),
    );

  const { pluginWrapper, setIsPluginOpen } = usePluginStore(
    useShallow((state) => ({
      pluginWrapper: state.pluginWrapper,
      setIsPluginOpen: state.setIsPluginOpen,
    })),
  );

  const { toast } = useToast();
  const { croppedImageToBlob } = useExtractCroppedClothing();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
  const [isGuideHovered, setIsGuideHovered] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const screenshotBackgroundRef = useRef<HTMLDivElement>(null);
  const screenshotAreaRef = useRef<HTMLDivElement>(null);
  const captureGuideRef = useRef<HTMLDivElement>(null);

  const resetCaptureOverlay = () => {
    if (screenshotBackgroundRef.current) {
      screenshotBackgroundRef.current.style.borderWidth = '0';
    }
    if (screenshotAreaRef.current) {
      screenshotAreaRef.current.style.top = '0';
      screenshotAreaRef.current.style.left = '0';
    }
  };

  const restorePluginVisibility = () => {
    if (!pluginWrapper) {
      return;
    }
    setIsPluginOpen(true);
    pluginWrapper.classList.toggle('thatzfit-visible', true);
    pluginWrapper.classList.toggle('thatzfit-hidden', false);
  };

  const getViewportSelectionRect = (x: number, y: number): CaptureRect => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const left = Math.max(0, Math.min(Math.min(x, startX), viewportWidth));
    const top = Math.max(0, Math.min(Math.min(y, startY), viewportHeight));
    const right = Math.max(0, Math.min(Math.max(x, startX), viewportWidth));
    const bottom = Math.max(0, Math.min(Math.max(y, startY), viewportHeight));

    return {
      left,
      top,
      width: Math.max(right - left, 0),
      height: Math.max(bottom - top, 0),
    };
  };

  const updateGuideHoverState = (x: number, y: number) => {
    const guideElement = captureGuideRef.current;
    if (!guideElement) {
      setIsGuideHovered(false);
      return;
    }

    const guideRect = guideElement.getBoundingClientRect();
    setIsGuideHovered(
      x >= guideRect.left &&
        x <= guideRect.right &&
        y >= guideRect.top &&
        y <= guideRect.bottom,
    );
  };

  const handleCroppedStart = (event: MouseEvent) => {
    updateGuideHoverState(event.clientX, event.clientY);
    setIsDragging(true);
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleCroppedAreaMove = (event: MouseEvent) => {
    updateGuideHoverState(event.clientX, event.clientY);

    if (
      !screenshotAreaRef.current ||
      !screenshotBackgroundRef.current ||
      !isDragging
    ) {
      return;
    }
    setIsMouseMoving(true);

    const rect = getViewportSelectionRect(event.clientX, event.clientY);
    const rightBorder = Math.max(
      window.innerWidth - (rect.left + rect.width),
      0,
    );
    const bottomBorder = Math.max(
      window.innerHeight - (rect.top + rect.height),
      0,
    );

    screenshotAreaRef.current.style.top = `${rect.top}px`;
    screenshotAreaRef.current.style.left = `${rect.left}px`;
    screenshotBackgroundRef.current.style.borderWidth = `${rect.top}px ${rightBorder}px ${bottomBorder}px ${rect.left}px`;
  };

  const handleCroppedEnd = async (event: MouseEvent) => {
    if (!isDragging) {
      return;
    }

    setIsDragging(false);
    setIsMouseMoving(false);
    setIsGuideHovered(false);

    const rect = getViewportSelectionRect(event.clientX, event.clientY);
    if (rect.width < 1 || rect.height < 1) {
      setIsFittingDialogOpen(false);
      setIsCapturing(false);
      resetCaptureOverlay();
      restorePluginVisibility();
      return;
    }

    setIsFittingDialogOpen(true);
    try {
      const capturedBlob = await croppedImageToBlob(rect);
      setCapturedClothingImage(capturedBlob);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[capture] capture failed', error);
      }
      toast.error(getCaptureErrorMessage(error));
      setIsFittingDialogOpen(false);
    } finally {
      setIsCapturing(false);
      resetCaptureOverlay();
      restorePluginVisibility();
    }
  };

  const handleCancelCapture = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDragging(false);
      setIsMouseMoving(false);
      setIsGuideHovered(false);
      setIsFittingDialogOpen(false);
      setIsCapturing(false);
      resetCaptureOverlay();
      restorePluginVisibility();
    }
  };

  return {
    isDragging,
    isMouseMoving,
    isGuideHovered,
    screenshotBackgroundRef,
    screenshotAreaRef,
    captureGuideRef,
    handleCroppedStart,
    handleCroppedAreaMove,
    handleCroppedEnd,
    handleCancelCapture,
    handleGuideMouseOut: () => setIsGuideHovered(false),
  };
};

export const useExtractCroppedClothing = () => {
  const setIsImageProcessing = useFittingStore(
    (state) => state.setIsImageProcessing,
  );

  const captureEngine = useMemo(
    () =>
      createCaptureEngine({
        setImageProcessing: setIsImageProcessing,
        proxyUrl: '/api/v1/try-on/image/proxy',
        fallbackToDisplayMedia: true,
      }),
    [setIsImageProcessing],
  );

  const croppedImageToBlob = (rect: CaptureRect) => {
    return captureEngine.capture(rect);
  };

  return { croppedImageToBlob };
};
