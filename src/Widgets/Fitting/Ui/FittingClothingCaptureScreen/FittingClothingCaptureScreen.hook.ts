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
  getCaptureWindow,
} from '@/Features/Fitting/Model/captureEngine';
import {
  captureDebugError,
  captureDebugInfo,
  captureDebugWarn,
  createCaptureDebugTraceId,
  setBlobDebugTraceId,
} from '@/Features/Fitting/Model/debug';

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
    captureDebugInfo(undefined, 'overlay.reset');
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
      captureDebugInfo(
        undefined,
        'plugin_visibility.restore_skipped_no_wrapper',
      );
      return;
    }
    captureDebugInfo(undefined, 'plugin_visibility.restore_start');
    setIsPluginOpen(true);
    pluginWrapper.classList.toggle('thatzfit-visible', true);
    pluginWrapper.classList.toggle('thatzfit-hidden', false);
    captureDebugInfo(undefined, 'plugin_visibility.restore_done', {
      className: pluginWrapper.className,
    });
  };

  const getViewportSelectionRect = (x: number, y: number): CaptureRect => {
    const captureWindow = getCaptureWindow();
    const viewportWidth = captureWindow.innerWidth;
    const viewportHeight = captureWindow.innerHeight;

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
    captureDebugInfo(undefined, 'selection.start', {
      x: event.clientX,
      y: event.clientY,
      captureWindow: {
        width: getCaptureWindow().innerWidth,
        height: getCaptureWindow().innerHeight,
      },
    });
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
      getCaptureWindow().innerWidth - (rect.left + rect.width),
      0,
    );
    const bottomBorder = Math.max(
      getCaptureWindow().innerHeight - (rect.top + rect.height),
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
      captureDebugWarn(undefined, 'selection.end_ignored_empty_rect', {
        rect,
        x: event.clientX,
        y: event.clientY,
      });
      setIsFittingDialogOpen(false);
      setIsCapturing(false);
      resetCaptureOverlay();
      restorePluginVisibility();
      return;
    }

    const debugTraceId = createCaptureDebugTraceId();
    captureDebugInfo(debugTraceId, 'selection.end_capture_start', {
      rect,
      x: event.clientX,
      y: event.clientY,
    });
    setIsFittingDialogOpen(true);
    try {
      const capturedBlob = await croppedImageToBlob(rect, debugTraceId);
      setBlobDebugTraceId(capturedBlob, debugTraceId);
      captureDebugInfo(debugTraceId, 'selection.capture_blob_stored', {
        blobSize: capturedBlob.size,
        blobType: capturedBlob.type,
      });
      setCapturedClothingImage(capturedBlob);
    } catch (error) {
      captureDebugError(debugTraceId, 'selection.capture_failed', { error });
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
      captureDebugInfo(undefined, 'selection.cancel_escape');
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
        fallbackToDisplayMedia: true,
      }),
    [setIsImageProcessing],
  );

  const croppedImageToBlob = (rect: CaptureRect, debugTraceId?: string) => {
    captureDebugInfo(debugTraceId, 'extract.crop_to_blob_start', { rect });
    return captureEngine.capture(rect, debugTraceId);
  };

  return { croppedImageToBlob };
};
