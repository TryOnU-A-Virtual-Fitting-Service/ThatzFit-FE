import { Minimize2 } from 'lucide-react';

import {
  FittingModelImage,
  useFittingModelStore,
} from '@/Entities/FittingModel';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import {
  Button,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/Shared/Components';

export const ModelZoomDialogContent = () => {
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );

  if (!entryWrapper) {
    return null;
  }

  return (
    <>
      <DialogTitle className='sr-only'>모델 확대</DialogTitle>
      <DialogContent
        className='z-[10000000]'
        overlayClassName='z-[10000000]'
        showCloseButton={false}
        container={entryWrapper}
        style={{
          position: 'fixed',
          top: '50vh',
          left: '50vw',
          zIndex: 10000000,
          width: 'min(30.3125rem, calc(100vw - 2rem))',
          maxWidth: 'calc(100vw - 2rem)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <DialogTitle className='sr-only'>모델 확대</DialogTitle>
        <DialogClose asChild>
          <Button
            size='icon'
            aria-label='모델 축소'
            className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 absolute top-4 right-4 h-5 w-5 cursor-pointer rounded-[0.3125rem] bg-white p-1'
          >
            <Minimize2 className='size-4' />
          </Button>
        </DialogClose>
        <div className='h-[min(37.75rem,calc(100vh-4rem))] w-full select-none'>
          <FittingModelImage
            src={currentFittingModel.defaultModelUrl}
            imageFileName={currentFittingModel.imageName}
            className='h-full w-full object-contain'
          />
        </div>
      </DialogContent>
    </>
  );
};
