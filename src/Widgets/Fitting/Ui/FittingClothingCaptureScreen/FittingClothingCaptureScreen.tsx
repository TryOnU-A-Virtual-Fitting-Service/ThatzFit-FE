import { createPortal } from 'react-dom';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { cn } from '@/Shared/Lib';

import { useCroppedClothing } from './FittingClothingCaptureScreen.hook';

export const FittingClothingCaptureScreen = () => {
  const isCapturing = useFittingStore((state) => state.isCapturing);

  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const isFittingDialogOpen = useFittingStore(
    (state) => state.isFittingDialogOpen,
  );
  const {
    isDragging,
    screenshotBackgroundRef,
    screenshotAreaRef,
    handleCroppedStart,
    handleCroppedAreaMove,
    handleCroppedEnd,
    handleCancelCapture,
  } = useCroppedClothing();

  const w = window.parent ?? window;

  if (!isCapturing || !pluginEntryWrapper) {
    return null;
  }

  return createPortal(
    <div
      tabIndex={-1}
      onKeyDown={handleCancelCapture}
      ref={(element) => {
        if (element) {
          element.focus({ preventScroll: true });
        }
      }}
      className={cn(isFittingDialogOpen && 'hidden')}
    >
      <div
        className={cn(
          'fixed top-0 left-0 z-[10000] block h-full w-full border-solid border-black opacity-30',
          isCapturing && 'cursor-crosshair',
        )}
        style={{
          borderWidth: isCapturing ? `0 0 ${w.innerHeight}px 0` : 0,
        }}
        onMouseDown={handleCroppedStart}
        onMouseMove={handleCroppedAreaMove}
        onMouseUp={handleCroppedEnd}
        ref={screenshotBackgroundRef}
      >
        <div
          className="fixed z-[10001] h-full w-full border-r-[1px] border-b-[1px] before:absolute before:top-[-100%] before:left-[-100%] before:border-solid before:border-red-500 before:content-['']"
          ref={screenshotAreaRef}
        ></div>
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
