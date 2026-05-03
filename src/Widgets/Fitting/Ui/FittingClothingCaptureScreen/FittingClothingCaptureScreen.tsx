import { createPortal } from 'react-dom';

import { getCaptureWindow } from '@/Features/Fitting/Model/captureEngine';

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
    isGuideHovered,
    captureGuideRef,
    screenshotBackgroundRef,
    screenshotAreaRef,
    handleCroppedStart,
    handleCroppedAreaMove,
    handleCroppedEnd,
    handleCancelCapture,
    handleGuideMouseOut,
  } = useCroppedClothing();

  if (!isCapturing || !pluginEntryWrapper) {
    return null;
  }

  const captureWindow = getCaptureWindow();
  const capturePortalContainer = captureWindow.document.body;

  return createPortal(
    <div
      data-thatzfit-capture-ui='true'
      tabIndex={-1}
      onKeyDown={handleCancelCapture}
      ref={(element) => {
        if (element) {
          element.focus({ preventScroll: true });
        }
      }}
      className={cn(isFittingDialogOpen && 'hidden')}
      style={isFittingDialogOpen ? { display: 'none' } : undefined}
    >
      <div
        data-thatzfit-capture-ui='true'
        className={cn(
          'fixed top-0 left-0 z-[10000] block h-full w-full border-solid border-black opacity-30',
          isCapturing && 'cursor-crosshair',
        )}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000000,
          display: 'block',
          width: '100vw',
          height: '100vh',
          borderStyle: 'solid',
          borderColor: '#000000',
          opacity: 0.3,
          cursor: 'crosshair',
          boxSizing: 'border-box',
          borderWidth: isCapturing ? `0 0 ${captureWindow.innerHeight}px 0` : 0,
        }}
        onMouseDown={handleCroppedStart}
        onMouseMove={handleCroppedAreaMove}
        onMouseOut={handleGuideMouseOut}
        onMouseUp={handleCroppedEnd}
        ref={screenshotBackgroundRef}
      >
        <div
          data-thatzfit-capture-ui='true'
          className="fixed z-[10001] h-full w-full border-r-[1px] border-b-[1px] before:absolute before:top-[-100%] before:left-[-100%] before:border-solid before:border-red-500 before:content-['']"
          style={{
            position: 'fixed',
            zIndex: 1000001,
            width: '100vw',
            height: '100vh',
            borderRight: '1px solid #ef4444',
            borderBottom: '1px solid #ef4444',
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
          ref={screenshotAreaRef}
        ></div>
      </div>
      {!isDragging && (
        <div
          data-thatzfit-capture-ui='true'
          ref={captureGuideRef}
          className='fixed top-20 z-[10000] rounded-lg bg-white py-3 text-center'
          style={{
            position: 'fixed',
            top: '80px',
            left: '50vw',
            zIndex: 1000002,
            width: 'min(42rem, calc(100vw - 32px))',
            transform: 'translateX(-50%)',
            borderRadius: '8px',
            background: '#ffffff',
            opacity: isGuideHovered ? 0.48 : 1,
            padding: '12px 16px',
            pointerEvents: 'none',
            textAlign: 'center',
            boxSizing: 'border-box',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
            transition: 'opacity 160ms ease',
          }}
        >
          <span
            className='text-grey-01 text-heading1'
            style={{
              color: '#181a1b',
              fontSize: '17px',
              fontWeight: 700,
              lineHeight: 1.5,
            }}
          >
            입어보고 싶은 옷의 사진 부분을 드래그해 주세요.
          </span>
        </div>
      )}
    </div>,
    capturePortalContainer,
  );
};
