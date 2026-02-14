import type { ChangeEvent, RefObject } from 'react';

import { useFittingModelStore } from '@/Entities/FittingModel';

type FittingModelUploadInputProps = {
  fileInputRef?: RefObject<HTMLInputElement | null>;
  setIsModelAddDialogOpen: (isModelAddDialogOpen: boolean) => void;
};

export const FittingModelUploadInput = ({
  fileInputRef,
  setIsModelAddDialogOpen,
}: FittingModelUploadInputProps) => {
  const setAddedFittingModel = useFittingModelStore(
    (state) => state.setAddedFittingModel,
  );

  const handleChangeFittingModel = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }
    setAddedFittingModel({
      modelImageFile: file,
      modelImageUrl: URL.createObjectURL(file),
    });
    setIsModelAddDialogOpen(true);
    event.target.value = '';
  };

  return (
    <input
      type='file'
      ref={fileInputRef}
      className='hidden'
      accept='image/*'
      onChange={handleChangeFittingModel}
    />
  );
};
