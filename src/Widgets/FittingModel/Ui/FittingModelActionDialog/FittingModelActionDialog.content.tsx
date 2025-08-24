import { useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import {
  FittingModelAddButton,
  FittingModelEditButton,
  FittingModelUploadInput,
} from '@/Features/FittingModel';

import { useFittingModelStore } from '@/Entities/FittingModel';
import { fittingModelQueries } from '@/Entities/FittingModel/Api';

import {
  Button,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/Shared/Components';

import { FittingModelAddDialog } from '../FittingModelAddDialog';

type FittingModelActionDialogContentProps = {
  iframeDocument: Document;
};

export const FittingModelActionDialogContent = ({
  iframeDocument,
}: FittingModelActionDialogContentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModelAddDialogOpen, setIsModelAddDialogOpen] =
    useState<boolean>(false);

  const { data: fittingModelList } = useSuspenseQuery({
    ...fittingModelQueries.listOptions(),
    select: (response) => response.data,
  });

  const setCurrentFittingModel = useFittingModelStore(
    (state) => state.setCurrentFittingModel,
  );

  const handleClickFittingModel = (defaultModelUrl: string) => {
    setCurrentFittingModel({
      modelUrl: defaultModelUrl,
      imageName: defaultModelUrl.split('/').pop() ?? '',
    });
  };

  return (
    <DialogContent
      container={iframeDocument?.body}
      showCloseButton={false}
      className='w-[12.5rem] overflow-visible p-2.5'
    >
      <DialogTitle className='sr-only'>모델 선택</DialogTitle>
      <div className='absolute top-[-1.875rem] right-0 flex w-full justify-end gap-2'>
        <FittingModelAddButton fileInputRef={fileInputRef} />
        <FittingModelUploadInput
          fileInputRef={fileInputRef}
          setIsModelAddDialogOpen={setIsModelAddDialogOpen}
        />
        <FittingModelAddDialog
          isOpen={isModelAddDialogOpen}
          setIsOpen={setIsModelAddDialogOpen}
        />
        <FittingModelEditButton />
      </div>
      <div className='flex h-full w-full flex-col'>
        {fittingModelList.map((fittingModel) => (
          <DialogClose key={fittingModel.defaultModelId}>
            <Button
              variant='ghost'
              className='text-body1 text-grey-01 hover:bg-grey-07 hover:text-grey-01 w-full bg-white'
              onClick={() =>
                handleClickFittingModel(fittingModel.defaultModelUrl)
              }
            >
              {fittingModel.modelName}
            </Button>
          </DialogClose>
        ))}
      </div>
    </DialogContent>
  );
};
