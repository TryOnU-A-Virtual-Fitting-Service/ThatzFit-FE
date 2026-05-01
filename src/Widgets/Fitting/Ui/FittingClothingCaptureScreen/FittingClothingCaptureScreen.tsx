import { createPortal } from 'react-dom';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Button } from '@/Shared/Components';
import { cn } from '@/Shared/Lib';
import { Spinner } from '@/Shared/Ui';

import { useCroppedClothing } from './FittingClothingCaptureScreen.hook';

export const FittingClothingCaptureScreen = () => {
  const isCapturing = useFittingStore((state) => state.isCapturing);
  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const {
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
  } = useCroppedClothing();

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
      className='fixed inset-0 z-[1000000] flex items-center justify-center bg-black/60 px-4 py-6'
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.6)',
        padding: '24px 16px',
      }}
    >
      <div
        className='flex max-h-full w-fit max-w-full flex-col gap-3 rounded-lg bg-white p-4 shadow-2xl'
        style={{
          maxWidth: 'calc(100vw - 32px)',
          maxHeight: 'calc(100vh - 48px)',
          borderRadius: '8px',
          background: '#ffffff',
          padding: '16px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.28)',
        }}
      >
        <div className='flex flex-col gap-1'>
          <span className='text-heading1-semibold text-grey-01'>
            입어볼 옷 영역을 선택해 주세요.
          </span>
          <span className='text-body2-regular text-grey-04'>
            이미지 안에서 드래그한 영역만 피팅에 사용돼요.
          </span>
        </div>

        <div
          className='flex min-h-[16rem] min-w-[18rem] items-center justify-center overflow-hidden rounded-md bg-black/5'
          style={{
            minWidth: '18rem',
            minHeight: '16rem',
            maxWidth: 'calc(100vw - 64px)',
            maxHeight: 'calc(100vh - 190px)',
            overflow: 'hidden',
            borderRadius: '6px',
            background: 'rgba(0, 0, 0, 0.05)',
          }}
          onMouseMove={handleCropMove}
          onMouseUp={handleCropEnd}
          onMouseLeave={handleCropEnd}
        >
          {isLoadingImage || !cropImageUrl ? (
            <Spinner />
          ) : (
            <div
              className={cn(
                'relative max-h-full max-w-full cursor-crosshair select-none',
                isDragging && 'cursor-crosshair',
              )}
              onMouseDown={handleCropStart}
            >
              <img
                ref={imageRef}
                src={cropImageUrl}
                alt='crop target clothing'
                draggable={false}
                className='block max-h-[calc(100vh-190px)] max-w-[calc(100vw-64px)] object-contain'
                style={{
                  display: 'block',
                  maxWidth: 'calc(100vw - 64px)',
                  maxHeight: 'calc(100vh - 190px)',
                  objectFit: 'contain',
                  userSelect: 'none',
                }}
              />
              {selection && (
                <div
                  className='pointer-events-none absolute border-2 border-red-500 bg-red-500/10'
                  style={{
                    left: selection.left,
                    top: selection.top,
                    width: selection.width,
                    height: selection.height,
                    border: '2px solid #ef4444',
                    background: 'rgba(239, 68, 68, 0.1)',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className='flex justify-end gap-2'>
          <Button
            variant='secondary'
            className='cursor-pointer'
            onClick={cancelCapture}
          >
            취소
          </Button>
          <Button
            className='cursor-pointer'
            disabled={isLoadingImage || !cropImageUrl}
            onClick={() => void cropSelectedImage()}
          >
            선택 완료
          </Button>
        </div>
      </div>
    </div>,
    pluginEntryWrapper,
  );
};
