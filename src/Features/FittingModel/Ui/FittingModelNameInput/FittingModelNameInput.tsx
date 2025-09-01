import { type ChangeEvent, useState } from 'react';

import { useFittingModelStore } from '@/Entities/FittingModel';

import { Input } from '@/Shared/Components';

type FittingModelNameInputProps = {
  modelId: Schema.FittingModel['defaultModelId'];
  editableModelName: Schema.FittingModel['modelName'];
  disabled?: boolean;
  updateModelName: (modelName: string) => void;
};

export const FittingModelNameInput = ({
  modelId,
  editableModelName,
  disabled = false,
  updateModelName,
}: FittingModelNameInputProps) => {
  const fittingModel = useFittingModelStore(
    (state) => state.defaultModels,
  ).find((fittingModel) => fittingModel.defaultModelId === modelId);

  const [currentModelName, setCurrentModelName] =
    useState<string>(editableModelName);

  const handleChangeModelName = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentModelName(event.target.value);
  };

  const handleBlurModelName = () => {
    const trimmedModelName = currentModelName.trim();

    if (!trimmedModelName) {
      updateModelName(fittingModel?.modelName ?? '');
      setCurrentModelName(fittingModel?.modelName ?? '');
      return;
    }

    updateModelName(currentModelName);
  };

  return (
    <Input
      type='text'
      value={currentModelName}
      className='bg-grey-08 text-grey-01 text-body1-medium h-full rounded-sm focus-visible:ring-0'
      onChange={handleChangeModelName}
      onBlur={handleBlurModelName}
      disabled={disabled}
    />
  );
};
