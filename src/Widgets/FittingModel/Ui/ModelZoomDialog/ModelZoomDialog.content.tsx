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
  return (
    <DialogContent
      className='z-[10000000]'
      overlayClassName='z-[10000000]'
      showCloseButton={false}
      container={entryWrapper}
    >
      <DialogTitle className='sr-only'>모델 확대</DialogTitle>
      <DialogClose asChild>
        <Button
          size='icon'
          className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 absolute top-4 right-4 h-5 w-5 cursor-pointer rounded-[0.3125rem] bg-white p-1'
        >
          <Minimize2 className='size-4' />
        </Button>
      </DialogClose>
      <div className='h-[37.75rem] w-[30.3125rem] select-none'>
        <FittingModelImage
          src={currentFittingModel.modelUrl}
          imageFileName={currentFittingModel.imageName}
          className='h-full w-full object-contain'
        />
      </div>
    </DialogContent>
  );
};
