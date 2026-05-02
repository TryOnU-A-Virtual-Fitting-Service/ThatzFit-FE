import { useShallow } from 'zustand/react/shallow';

import {
  FittingCancelButton,
  FittingExecutionButton,
} from '@/Features/Fitting';
import {
  captureDebugInfo,
  getBlobDebugDetails,
} from '@/Features/Fitting/Model/debug';

import { useFittingStore } from '@/Entities/Fitting';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import { Dialog, DialogContent, DialogTitle } from '@/Shared/Components';
import { Spinner } from '@/Shared/Ui';

export const FittingDialog = () => {
  const pluginEntryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const {
    capturedClothingImage,
    isFittingDialogOpen,
    isImageProcessing,
    setIsFittingDialogOpen,
  } = useFittingStore(
    useShallow((state) => ({
      capturedClothingImage: state.capturedClothingImage,
      isFittingDialogOpen: state.isFittingDialogOpen,
      isImageProcessing: state.isImageProcessing,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
    })),
  );

  if (!capturedClothingImage || !pluginEntryWrapper) {
    return null;
  }

  captureDebugInfo(
    getBlobDebugDetails(capturedClothingImage)?.debugTraceId,
    'dialog.render',
    {
      isFittingDialogOpen,
      isImageProcessing,
      capturedBlob: getBlobDebugDetails(capturedClothingImage),
    },
  );

  return (
    <Dialog open={isFittingDialogOpen} onOpenChange={setIsFittingDialogOpen}>
      <DialogTitle className='sr-only'>피팅 실행 Dialog</DialogTitle>
      <DialogContent
        showCloseButton={false}
        overlayClassName='hidden'
        className='w-fit border-none p-5'
        container={pluginEntryWrapper}
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
