import { createPortal } from 'react-dom';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { cn } from '@/Shared/Lib';

import { useCroppedClothing } from './FittingClothingCaptureScreen.hook';

export const FittingClothingCaptureScreen = () => {
  const isCapturing = useFittingStore((state) => state.isCapturing);

  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const {
    isDragging,
    isMouseMoving,
    screenshotBackgroundRef,
    screenshotAreaRef,
    handleCroppedStart,
    handleCroppedAreaMove,
    handleCroppedEnd,
    handleCancelCapture,
  } = useCroppedClothing();

  if (!isCapturing || !pluginEntryWrapper) {
    return null;
  }

  return createPortal(
    <div
      tabIndex={-1}
      onKeyDown={handleCancelCapture}
      ref={(element) => {
        element?.focus();
      }}
    >
      <div
        className={cn(
          'fixed top-0 left-0 z-[10000] h-screen w-screen border-solid border-black opacity-30',
          isMouseMoving ? 'bg-none' : 'bg-black',
          isDragging && 'cursor-crosshair',
        )}
        onMouseDown={handleCroppedStart}
        onMouseMove={handleCroppedAreaMove}
        onMouseUp={handleCroppedEnd}
        ref={screenshotBackgroundRef}
      >
        {isDragging && (
          <div
            className='fixed z-[10001] h-full w-full before:fixed before:top-[-100%] before:left-[-100%] before:h-full before:w-full before:border-r-[1px] before:border-b-[1px] before:border-white before:content-[""] after:fixed after:top-[0] after:left-[0] after:h-full after:w-full after:border-t-[1px] after:border-l-[1px] after:content-[""]'
            ref={screenshotAreaRef}
          ></div>
        )}
      </div>
      {!isDragging && (
        <div className='fixed top-20 left-1/2 z-[10000] w-2xl -translate-x-1/2 rounded-lg bg-white py-3 text-center'>
          <span className='text-grey-01 text-heading1'>
            입어보고 싶은 옷의 사진 부분을 드래그해 주세요.
          </span>
        </div>
      )}
    </div>,
    pluginEntryWrapper,
  );
};
