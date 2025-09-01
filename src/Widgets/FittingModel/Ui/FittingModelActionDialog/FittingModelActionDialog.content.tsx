import { useEffect, useRef, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { FittingModelEditList } from '@/Widgets/FittingModel/Ui/FittingModelEditList';
import { FittingModelList } from '@/Widgets/FittingModel/Ui/FittingModelList';

import {
  FITTING_MODEL_ACTION_MODE,
  type FittingModelActionMode,
  FittingModelAddButton,
  FittingModelEditButton,
  FittingModelUploadInput,
} from '@/Features/FittingModel';

import { useFittingModelStore } from '@/Entities/FittingModel';
import { fittingModelQueries } from '@/Entities/FittingModel/Api';

import { DialogContent } from '@/Shared/Components';

import { FittingModelAddDialog } from '../FittingModelAddDialog';

type FittingModelActionDialogContentProps = {
  iframeDocument: Document;
  isModelActionDialogOpen: boolean;
  setIsModelActionDialogOpen: (isModelActionDialogOpen: boolean) => void;
};

export const FittingModelActionDialogContent = ({
  iframeDocument,
  isModelActionDialogOpen,
  setIsModelActionDialogOpen,
}: FittingModelActionDialogContentProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModelAddDialogOpen, setIsModelAddDialogOpen] =
    useState<boolean>(false);

  const [fittingModelActionMode, setFittingModelActionMode] =
    useState<FittingModelActionMode>(FITTING_MODEL_ACTION_MODE.SELECT);

  const setFittingModelList = useFittingModelStore(
    (state) => state.setDefaultModels,
  );

  const { data: fittingModelList } = useSuspenseQuery({
    ...fittingModelQueries.listOptions(),
    select: (response) => response.data,
  });

  useEffect(() => {
    setFittingModelActionMode(FITTING_MODEL_ACTION_MODE.SELECT);
  }, [isModelActionDialogOpen]);

  useEffect(() => {
    setFittingModelList(fittingModelList);
  }, [fittingModelList, setFittingModelList]);

  return (
    <>
      <DialogContent
        container={iframeDocument?.body}
        showCloseButton={false}
        className='w-[12.5rem] overflow-visible p-2.5'
      >
        <div className='absolute top-[-1.875rem] right-0 flex w-full justify-end gap-2'>
          <FittingModelAddButton
            fittingModelCount={fittingModelList.length}
            fileInputRef={fileInputRef}
          />
          <FittingModelUploadInput
            fileInputRef={fileInputRef}
            setIsModelAddDialogOpen={setIsModelAddDialogOpen}
          />
          <FittingModelEditButton
            setFittingModelActionMode={setFittingModelActionMode}
          />
        </div>
        {fittingModelActionMode === FITTING_MODEL_ACTION_MODE.SELECT && (
          <FittingModelList fittingModelList={fittingModelList} />
        )}
        {fittingModelActionMode === FITTING_MODEL_ACTION_MODE.EDIT && (
          <FittingModelEditList
            fittingModelList={fittingModelList}
            setModelActionMode={setFittingModelActionMode}
          />
        )}
      </DialogContent>
      <FittingModelAddDialog
        isOpen={isModelAddDialogOpen}
        setIsOpen={setIsModelAddDialogOpen}
        setIsModelActionDialogOpen={setIsModelActionDialogOpen}
      />
    </>
  );
};
