export type CurrentFittingModel = {
  defaultModelUrl: Schema.FittingModel['defaultModelUrl'];
  imageName: string;
  modelName: Schema.FittingModel['modelName'];
  defaultModelId: Schema.FittingModel['defaultModelId'];
  selectionSource?: 'history';
};

const createCurrentFittingModel = (
  fittingModel: Schema.FittingModel,
): CurrentFittingModel => ({
  defaultModelUrl: fittingModel.defaultModelUrl,
  imageName: fittingModel.defaultModelUrl.split('/').pop() ?? '',
  modelName: fittingModel.modelName,
  defaultModelId: fittingModel.defaultModelId,
});

type ResolveCurrentFittingModelParams = {
  currentFittingModel: CurrentFittingModel;
  fittingModelList: Schema.FittingModel[];
};

export const resolveCurrentFittingModel = ({
  currentFittingModel,
  fittingModelList,
}: ResolveCurrentFittingModelParams): CurrentFittingModel => {
  const fallbackModel = fittingModelList[0];

  if (!fallbackModel) {
    return currentFittingModel;
  }

  const hasCurrentModel = currentFittingModel.defaultModelUrl.length > 0;
  const isHistorySelection = currentFittingModel.selectionSource === 'history';
  const isCurrentModelAvailable = fittingModelList.some(
    (fittingModel) =>
      fittingModel.defaultModelId === currentFittingModel.defaultModelId ||
      fittingModel.defaultModelUrl === currentFittingModel.defaultModelUrl,
  );

  if (hasCurrentModel && (isHistorySelection || isCurrentModelAvailable)) {
    return currentFittingModel;
  }

  return createCurrentFittingModel(fallbackModel);
};
