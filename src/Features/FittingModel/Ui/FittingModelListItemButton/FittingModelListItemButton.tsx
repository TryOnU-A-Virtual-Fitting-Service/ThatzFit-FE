import { useFittingModelStore } from '@/Entities/FittingModel';

import { Button, DialogClose } from '@/Shared/Components';

type FittingModelListItemButtonProps = {
  fittingModel: Schema.FittingModel;
};

export const FittingModelListItemButton = ({
  fittingModel,
}: FittingModelListItemButtonProps) => {
  const setCurrentFittingModel = useFittingModelStore(
    (state) => state.setCurrentFittingModel,
  );

  const handleSelectFittingModel = ({
    defaultModelUrl,
    modelName,
  }: {
    defaultModelUrl: string;
    modelName: Schema.FittingModel['modelName'];
  }) => {
    setCurrentFittingModel({
      defaultModelUrl: defaultModelUrl,
      imageName: defaultModelUrl.split('/').pop() ?? '',
      modelName,
      defaultModelId: fittingModel.defaultModelId,
    });
  };

  return (
    <DialogClose>
      <Button
        variant='ghost'
        className='text-body1 text-grey-01 hover:bg-grey-07 hover:text-grey-01 w-full bg-white'
        onClick={() =>
          handleSelectFittingModel({
            defaultModelUrl: fittingModel.defaultModelUrl,
            modelName: fittingModel.modelName,
          })
        }
      >
        {fittingModel.modelName}
      </Button>
    </DialogClose>
  );
};
