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

    const right = document.body.clientWidth - Math.max(x, startX);
    const bottom = window.innerHeight - Math.max(y, startY);

    screenshotAreaRef.current.style.top = `${top}px`;
    screenshotAreaRef.current.style.left = `${left}px`;

    screenshotBackgroundRef.current.style.borderWidth = `${top}px ${right}px ${bottom}px ${left}px`;
  };

  const handleCroppedEnd = async (event: MouseEvent) => {
    const x = event.clientX;
    const y = event.clientY;

    const scrollWidth = window.innerWidth - document.body.clientWidth;

    const top = Math.min(y, startY);
    const left = Math.min(x, startX);
    const width = Math.max(x, startX) - left + scrollWidth;
    const height = Math.max(y, startY) - top;

    setIsFittingDialogOpen(true);
    setIsDragging(false);
    setIsMouseMoving(false);
    try {
      await croppedImageToBlob({
        left,
        top: top + window.scrollY,
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
  }) =>
    html2canvas(document.body, {
      allowTaint: true,
      useCORS: true,
      width: document.body.clientWidth,
      onclone: async (cloneDoc) => {
        setIsImageProcessing(true);
        const imgList = cloneDoc.querySelectorAll('img');

        const promiseList = [...imgList].map(async (img, idx) => {
          const rect = img.getBoundingClientRect();
          const isIntersecting = !(
            left + width < rect.left ||
            left > rect.right ||
            top + height < rect.top ||
            top > rect.bottom
          );

          // NOTE: 캡처 영역과 겹치는 이미지만 처리, 겹치지 않는 이미지는 cloneDoc에서 제거
          if (isIntersecting) {
            let imgUrl = '';
            await postClothesImageDataUrl(
              {
                imageUrl: img.src,
              },
              {
                onSuccess: ({ data: { dataUrl } }) => {
                  imgUrl = dataUrl;
                },
              },
            );
            imgList[idx].src = imgUrl;
          } else {
            imgList[idx].src = '';
            imgList[idx].style.display = 'none';
          }
        });
        await Promise.all(promiseList);
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

  return { croppedImageToBlob };
};
