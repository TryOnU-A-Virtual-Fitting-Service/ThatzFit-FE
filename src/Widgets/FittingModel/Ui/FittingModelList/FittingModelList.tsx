import { FittingModelListItemButton } from '@/Features/FittingModel';

import type { GetFittingModelListResponseDto } from '@/Entities/FittingModel/Type';

import { DialogTitle } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

type FittingModelListProps = {
  fittingModelList: GetFittingModelListResponseDto;
};

export const FittingModelList = ({
  fittingModelList,
}: FittingModelListProps) => {
  const copy = getPluginCopy();

  return (
    <>
      <DialogTitle className='sr-only'>{copy.model.selectTitle}</DialogTitle>
      <div className='flex h-full w-full flex-col'>
        {fittingModelList.map((fittingModel) => (
          <FittingModelListItemButton
            key={fittingModel.defaultModelId}
            fittingModel={fittingModel}
          />
        ))}
      </div>
    </>
  );
};
