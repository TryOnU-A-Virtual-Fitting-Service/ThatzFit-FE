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
  const entryWrapper = usePluginEntryStore((state) => state.entryWrapper);
  const addedFittingModel = useFittingModelStore(
    (state) => state.addedFittingModel,
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        container={entryWrapper}
        className='!h-[26.875rem] !w-[20.625rem]'
        showCloseButton={false}
      >
        <DialogTitle className='sr-only'>모델 추가</DialogTitle>
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
              이 사진을 모델 메뉴에 추가할까요?
            </span>
            <span className='text-body1-regular text-center text-[#788089]'>
              단순한 자세의 단독 전신/반신 사진일수록 <br />
              피팅이 더 자연스럽게 적용돼요!
            </span>
          </div>
          <div className='flex w-full gap-2'>
            <DialogClose asChild>
              <Button variant='secondary' size='lg' className='!grow'>
                취소
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
