import { useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  FittingCancelButton,
  FittingExecutionButton,
} from '@/Features/Fitting';
import {
  captureDebugInfo,
  captureDebugWarn,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '@/Features/Fitting/Model/debug';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Dialog, DialogContent, DialogTitle } from '@/Shared/Components';
import { Spinner } from '@/Shared/Ui';

export const FittingDialog = () => {
  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const {
    capturedClothingImage,
    isCapturing,
    isFittingDialogOpen,
    isImageProcessing,
    setIsFittingDialogOpen,
  } = useFittingStore(
    useShallow((state) => ({
      capturedClothingImage: state.capturedClothingImage,
      isCapturing: state.isCapturing,
      isFittingDialogOpen: state.isFittingDialogOpen,
      isImageProcessing: state.isImageProcessing,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
    })),
  );

  const debugTraceId = getBlobDebugTraceId(capturedClothingImage);
  const capturedBlob = useMemo(
    () => getBlobDebugDetails(capturedClothingImage),
    [capturedClothingImage],
  );

  useEffect(() => {
    captureDebugInfo(debugTraceId, 'dialog.render_state', {
      isFittingDialogOpen,
      isCapturing,
      isImageProcessing,
      hasPluginEntryWrapper: Boolean(pluginEntryWrapper),
      capturedBlob,
    });

    if (
      isFittingDialogOpen &&
      !isCapturing &&
      !isImageProcessing &&
      (!capturedClothingImage || !pluginEntryWrapper)
    ) {
      captureDebugWarn(
        debugTraceId,
        'dialog.open_without_render_prerequisite',
        {
          hasCapturedClothingImage: Boolean(capturedClothingImage),
          hasPluginEntryWrapper: Boolean(pluginEntryWrapper),
          isCapturing,
          isImageProcessing,
          capturedBlob,
        },
      );
    }
  }, [
    capturedBlob,
    capturedClothingImage,
    debugTraceId,
    isCapturing,
    isFittingDialogOpen,
    isImageProcessing,
    pluginEntryWrapper,
  ]);

  const handleOpenChange = (nextOpen: boolean) => {
    captureDebugInfo(debugTraceId, 'dialog.open_change', {
      previousOpen: isFittingDialogOpen,
      nextOpen,
      capturedBlob,
    });
    setIsFittingDialogOpen(nextOpen);
  };

  if (!capturedClothingImage || !pluginEntryWrapper) {
    return null;
  }

  return (
    <Dialog open={isFittingDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTitle className='sr-only'>피팅 실행 Dialog</DialogTitle>
      <DialogContent
        showCloseButton={false}
        overlayClassName='hidden'
        className='w-fit border-none p-5'
        container={pluginEntryWrapper}
        style={{ zIndex: 1000003 }}
        onEscapeKeyDown={() => {
          captureDebugInfo(debugTraceId, 'dialog.escape_key_down');
        }}
        onInteractOutside={(event) => {
          captureDebugWarn(debugTraceId, 'dialog.interact_outside_prevented', {
            eventType: event.type,
          });
          event.preventDefault();
        }}
      >
        <DialogTitle className='sr-only'>피팅 실행 Dialog</DialogTitle>
        <div className='flex w-[18rem] flex-col items-center gap-5'>
          <div className='!border-grey-04 flex h-[15.625rem] w-[18rem] justify-center rounded-md border-[1px] px-5'>
            {isImageProcessing ? (
              <div className='flex h-full w-full items-center justify-center'>
                <Spinner />
              </div>
            ) : (
              <img
                src={URL.createObjectURL(capturedClothingImage)}
                alt='captured clothing image'
                className='mx-5 h-full object-contain'
              />
            )}
          </div>
          <div className='flex flex-col items-center gap-1'>
            <span className='text-heading1-semibold text-black'>
              이 옷을 입어볼까요?
            </span>
            <span className='text-body1-regular text-grey-04'>
              상/하의만 입어볼 수 있어요.
            </span>
          </div>
          <div className='flex w-full gap-2'>
            <FittingCancelButton />
            <FittingExecutionButton />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
