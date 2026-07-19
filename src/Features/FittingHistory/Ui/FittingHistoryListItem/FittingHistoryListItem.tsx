import { useFittingModelStore } from '@/Entities/FittingModel';

import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';
import { cn } from '@/Shared/Lib';

type FittingHistoryListItemProps = {
  fittingHistory: Schema.FittingHistory;
};

export const FittingHistoryListItem = ({
  fittingHistory,
}: FittingHistoryListItemProps) => {
  const copy = getPluginCopy();
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );
  const setCurrentFittingModel = useFittingModelStore(
    (state) => state.setCurrentFittingModel,
  );
  const isSelected =
    currentFittingModel.selectionSource === 'history' &&
    currentFittingModel.defaultModelUrl === fittingHistory.tryOnResultUrl;

  const handleClickFittingHistoryItem = () => {
    const { tryOnResultUrl, modelName, defaultModelId } = fittingHistory;
    setCurrentFittingModel({
      modelName: modelName ?? currentFittingModel.modelName,
      defaultModelId: defaultModelId ?? currentFittingModel.defaultModelId,
      defaultModelUrl: tryOnResultUrl,
      imageName: tryOnResultUrl.split('/').pop() ?? tryOnResultUrl,
      selectionSource: 'history',
    });
  };

  return (
    <Button
      variant='ghost'
      className={cn(
        'border-grey-04 h-10 w-10 min-w-0 shrink-0 cursor-pointer rounded-md border bg-white p-0 hover:bg-white',
        isSelected && 'border-black ring-1 ring-black',
      )}
      onClick={handleClickFittingHistoryItem}
      aria-pressed={isSelected}
    >
      <img
        src={fittingHistory.tryOnResultUrl}
        alt={copy.history.resultAlt}
        className='h-full w-full object-contain'
      />
    </Button>
  );
};
