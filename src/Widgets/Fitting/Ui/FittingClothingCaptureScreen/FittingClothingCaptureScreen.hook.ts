import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginStore } from '@/Entities/Plugin';

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

  const { croppedImageToBlob } = useExtractCroppepClothing();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMouseMoving, setIsMouseMoving] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const screenshotBackgroundRef = useRef<HTMLDivElement>(null);
  const screenshotAreaRef = useRef<HTMLDivElement>(null);

  const handleCroppedStart = (event: MouseEvent) => {
    setIsDragging(true);
    setStartX(event.clientX);
    setStartY(event.clientY);
  };

  const handleCroppedAreaMove = (event: MouseEvent) => {
    if (!screenshotAreaRef.current || !screenshotBackgroundRef.current) {
      return;
    }
    setIsMouseMoving(true);

    const x = event.clientX;
    const y = event.clientY;

    const top = Math.min(y, startY);
    const left = Math.min(x, startX);

    const right = window.innerWidth - Math.max(x, startX);
    const bottom = window.innerHeight - Math.max(y, startY);

    screenshotAreaRef.current.style.top = `${top}px`;
    screenshotAreaRef.current.style.left = `${left}px`;

    screenshotBackgroundRef.current.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
  };

  const handleCroppedEnd = (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const top = Math.min(y, startY);
    const left = Math.min(x, startX);
    const width = Math.max(x, startX) - left;
    const height = Math.max(y, startY) - top;

    croppedImageToBlob({
      left,
      top,
      width,
      height,
      callback: setCapturedClothingImage,
    });
    setIsFittingDialogOpen(true);

    // NOTE: 캡처 완료 후 상태 초기화
    setIsDragging(false);
    setIsMouseMoving(false);
    setIsCapturing(false);

    if (!pluginWrapper) {
      return;
    }

    setIsPluginOpen(true);
    pluginWrapper.classList.toggle('thatzfit-visible');
    pluginWrapper.classList.toggle('thatzfit-hidden');
  };

  const handleCancelCapture = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsCapturing(false);
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

export const useExtractCroppepClothing = () => {
  const extractCroppedImageToBlob = (
    canvas?: HTMLCanvasElement,
    callback?: (blob: Blob) => void,
  ) => {
    if (!canvas) {
      return;
    }

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }
      callback?.(blob);
    });
  };

  const croppedImageToBlob = ({
    left,
    top,
    width,
    height,
    callback,
  }: {
    left: number;
    top: number;
    width: number;
    height: number;
    callback: (blob: Blob) => void;
  }) =>
    html2canvas(document.body).then((canvas) => {
      const img = canvas
        .getContext('2d')
        ?.getImageData(left, top, width, height);

      const cvs = document.createElement('canvas');
      cvs.width = width;
      cvs.height = height;

      if (!img) {
        return;
      }
      cvs.getContext('2d')?.putImageData(img, 0, 0);
      extractCroppedImageToBlob(cvs, callback);
    });

  return { croppedImageToBlob };
};
