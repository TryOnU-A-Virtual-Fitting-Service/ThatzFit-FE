import { type KeyboardEvent, type MouseEvent, useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';
import { useShallow } from 'zustand/react/shallow';

import { usePostClothesImageDataUrl } from '@/Features/Fitting';

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

  const w = window.parent ?? window;
  const d = parent.document ?? document;

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

    const x = event.clientX;
    const y = event.clientY;

    const top = Math.min(y, startY);
    const left = Math.min(x, startX);
    const right = d.body.clientWidth - Math.max(x, startX);
    const bottom = w.innerHeight - Math.max(y, startY);

    screenshotAreaRef.current.style.top = `${top}px`;
    screenshotAreaRef.current.style.left = `${left}px`;

    screenshotBackgroundRef.current.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
  };

  const handleCroppedEnd = async (event: MouseEvent) => {
    const x = event.clientX + w.scrollX;
    const y = event.clientY + w.scrollY;

    const sx = startX + w.scrollX;
    const sy = startY + w.scrollY;

    const scrollWidth = w.innerWidth - d.body.clientWidth;

    const top = Math.min(y, sy);
    const left = Math.min(x, sx);
    const width = Math.max(x, sx) - left + scrollWidth;
    const height = Math.max(y, sy) - top;

    setIsFittingDialogOpen(true);
    setIsDragging(false);
    setIsMouseMoving(false);
    try {
      croppedImageToBlob({
        left,
        top,
        width,
        height,
        callback: setCapturedClothingImage,
      });
    } catch {
      toast.error('옷 캡처에 실패했어요.');
      setIsFittingDialogOpen(false);
      if (screenshotBackgroundRef.current) {
        screenshotBackgroundRef.current.style.borderWidth = '0';
      }
      if (screenshotAreaRef.current) {
        screenshotAreaRef.current.style.top = '0';
        screenshotAreaRef.current.style.left = '0';
      }
    } finally {
      setIsCapturing(false);
      if (pluginWrapper) {
        setIsPluginOpen(true);
        pluginWrapper.classList.toggle('thatzfit-visible');
        pluginWrapper.classList.toggle('thatzfit-hidden');
      }
    }
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

export const useExtractCroppedClothing = () => {
  const w = window.parent ?? window;
  const d = parent.document ?? document;

  const setIsImageProcessing = useFittingStore(
    (state) => state.setIsImageProcessing,
  );

  const { mutateAsync: postClothesImageDataUrl } = usePostClothesImageDataUrl();

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
  }) => {
    const originalImageList = w.document.querySelectorAll('img');
    const originalImageListArray = Array.from(originalImageList);

    html2canvas(d.body, {
      allowTaint: true,
      useCORS: true,
      scale: 1,
      x: 0,
      y: 0,
      width: d.body.scrollWidth,
      height: d.body.scrollHeight,
      onclone: async (cloneDoc) => {
        setIsImageProcessing(true);
        const imgList = cloneDoc.querySelectorAll('img');
        for (let idx = 0; idx < originalImageListArray.length; idx++) {
          const originalImage = originalImageListArray[idx];
          const clonedImage = imgList[idx];

          if (!clonedImage) {
            continue;
          }

          const rect = originalImage.getBoundingClientRect();
          const { scrollX, scrollY } = w;

          const rectTop = rect.top + scrollY;
          const rectBottom = rect.bottom + scrollY;
          const rectLeft = rect.left + scrollX;
          const rectRight = rect.right + scrollX;

          const isNotIntersecting =
            left + width < rectLeft ||
            left > rectRight ||
            top + height < rectTop ||
            top > rectBottom;

          if (!isNotIntersecting) {
            await postClothesImageDataUrl(
              {
                imageUrl: originalImage.src,
              },
              {
                onSuccess: ({ data: { dataUrl } }) => {
                  clonedImage.src = dataUrl;
                },
              },
            );
          } else {
            const width = originalImage.style.width;
            const height = originalImage.style.height;
            const div = document.createElement('div');
            div.style.width = width;
            div.style.height = height;

            clonedImage.replaceWith(div);
          }
        }
        setIsImageProcessing(false);
      },
    }).then((canvas) => {
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
  };

  return { croppedImageToBlob };
};
