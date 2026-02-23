import {
  type KeyboardEvent,
  type MouseEvent,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useShallow } from 'zustand/react/shallow';

import { usePostClothesImageDataUrl } from '@/Features/Fitting';
import {
  type CaptureRect,
  createCaptureEngine,
} from '@/Features/Fitting/Model/captureEngine';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

import { useToast } from '@/Shared/Model';

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
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const screenshotBackgroundRef = useRef<HTMLDivElement>(null);
  const screenshotAreaRef = useRef<HTMLDivElement>(null);

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

  const handleCroppedStart = (event: MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleCroppedAreaMove = (event: MouseEvent) => {
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
    } catch {
      toast.error('옷 캡처에 실패했어요.');
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
      setIsFittingDialogOpen(false);
      setIsCapturing(false);
      resetCaptureOverlay();
      restorePluginVisibility();
    }
  };

  return {
    isDragging,
    isMouseMoving,
    screenshotBackgroundRef,
    screenshotAreaRef,
    handleCroppedStart,
    handleCroppedAreaMove,
    handleCroppedEnd,
    handleCancelCapture,
  };
};

export const useExtractCroppedClothing = () => {
  const setIsImageProcessing = useFittingStore(
    (state) => state.setIsImageProcessing,
  );

  const { mutateAsync: postClothesImageDataUrl } = usePostClothesImageDataUrl();
  const captureEngine = useMemo(
    () =>
      createCaptureEngine({
        convertImageToDataUrl: async (imageUrl: string) => {
          const response = await postClothesImageDataUrl({ imageUrl });
          return response.data.dataUrl;
        },
        setImageProcessing: setIsImageProcessing,
      }),
    [postClothesImageDataUrl, setIsImageProcessing],
  );

  const croppedImageToBlob = (rect: CaptureRect) => {
    return captureEngine.capture(rect);
  };

  return { croppedImageToBlob };
};
