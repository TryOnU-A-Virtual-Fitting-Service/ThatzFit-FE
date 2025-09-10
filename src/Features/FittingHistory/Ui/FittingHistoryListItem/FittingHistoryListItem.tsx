import { useFittingModelStore } from '@/Entities/FittingModel';

import { Button } from '@/Shared/Components';

type FittingHistoryListItemProps = {
  fittingHistory: Schema.FittingHistory;
};

export const FittingHistoryListItem = ({
  fittingHistory,
}: FittingHistoryListItemProps) => {
  const setCurrentFittingModel = useFittingModelStore(
    (state) => state.setCurrentFittingModel,
  );

  const handleClickFittingHistoryItem = () => {
    const { tryOnResultUrl, modelName, defaultModelId } = fittingHistory;
    setCurrentFittingModel({
      modelName,
      defaultModelId,
      defaultModelUrl: tryOnResultUrl,
      imageName: tryOnResultUrl,
    });
  };

  return (
    <Button
      variant='ghost'
      className='border-grey-04 h-10 w-10 min-w-0 shrink-0 cursor-pointer rounded-md border bg-white p-0 hover:bg-white'
      onClick={handleClickFittingHistoryItem}
    >
      <img
        src={fittingHistory.tryOnResultUrl}
        className='h-full w-full object-contain'
      />
    </Button>
  );
};
