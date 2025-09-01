import { FittingModelListItemButton } from '@/Features/FittingModel';

import type { GetFittingModelListResponseDto } from '@/Entities/FittingModel/Type';

import { DialogTitle } from '@/Shared/Components';

type FittingModelListProps = {
  fittingModelList: GetFittingModelListResponseDto;
};

export const FittingModelList = ({
  fittingModelList,
}: FittingModelListProps) => {
  return (
    <>
      <DialogTitle className='sr-only'>모델 선택</DialogTitle>
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
