import { FittingModelUploadButton } from '@/Features/FittingModel';

import {
  FittingModelImage,
  useFittingModelStore,
} from '@/Entities/FittingModel';
import { usePluginEntryStore } from '@/Entities/PluginEntry';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

type FittingModelAddDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsModelActionDialogOpen: (isModelActionDialogOpen: boolean) => void;
};

export const FittingModelAddDialog = ({
  isOpen,
  setIsOpen,
  setIsModelActionDialogOpen,
}: FittingModelAddDialogProps) => {
  const copy = getPluginCopy();
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const addedFittingModel = useFittingModelStore(
    (state) => state.addedFittingModel,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTitle className='sr-only'>{copy.model.addTitle}</DialogTitle>
      <DialogContent
        container={entryWrapper}
        className='!h-[26.875rem] !w-[20.625rem]'
        showCloseButton={false}
      >
        <DialogTitle className='sr-only'>{copy.model.addTitle}</DialogTitle>
        <div className='flex h-full w-full flex-col items-center gap-4'>
          {addedFittingModel && (
            <FittingModelImage
              src={addedFittingModel.modelImageUrl}
              imageFileName={addedFittingModel.modelImageFile.name}
              className='h-[15.5rem] object-contain'
            />
          )}
          <div className='flex flex-col items-center gap-1.5'>
            <span className='text-heading1-semibold font-sans text-black'>
              {copy.model.addQuestion}
            </span>
            <span className='text-body1-regular text-center text-[#788089]'>
              {copy.model.addHelpLine1} <br />
              {copy.model.addHelpLine2}
            </span>
          </div>
          <div className='flex w-full gap-2'>
            <DialogClose asChild>
              <Button variant='secondary' size='lg' className='!grow'>
                {copy.common.cancel}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <FittingModelUploadButton
                setIsFittingModelAddDialogOpen={setIsOpen}
                setIsModelActionDialogOpen={setIsModelActionDialogOpen}
              />
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
