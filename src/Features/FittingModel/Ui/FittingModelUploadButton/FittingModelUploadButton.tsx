import { useShallow } from 'zustand/react/shallow';

import { useFittingModelStore } from '@/Entities/FittingModel';

import { Button } from '@/Shared/Components';

type FittingModelUploadButtonProps = {
  setIsFittingModelAddDialogOpen: (
    isFittingModelAddDialogOpen: boolean,
  ) => void;
  setIsModelActionDialogOpen: (isModelActionDialogOpen: boolean) => void;
};

export const FittingModelUploadButton = ({
  setIsFittingModelAddDialogOpen,
  setIsModelActionDialogOpen,
}: FittingModelUploadButtonProps) => {
  const { addedFittingModel, setFittingModelUploadStatus } =
    useFittingModelStore(
      useShallow((state) => ({
        addedFittingModel: state.addedFittingModel,
        setFittingModelUploadStatus: state.setFittingModelUploadStatus,
        setCurrentFittingModel: state.setCurrentFittingModel,
      })),
    );

  const handleClickUploadFittingModel = async () => {
    if (!addedFittingModel) {
      return;
    }

    setIsModelActionDialogOpen(false);
    setFittingModelUploadStatus({ isUploading: true });
    setIsFittingModelAddDialogOpen(false);
  };

  return (
    <Button
      variant='default'
      size='lg'
      className='!grow'
      onClick={handleClickUploadFittingModel}
    >
      확인
    </Button>
  );
};
