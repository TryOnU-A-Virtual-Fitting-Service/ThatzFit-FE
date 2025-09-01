type FittingModelUpdateStatus = 'UPDATE' | 'DELETE';

export type UpdateFittingModel = {
  id: Schema.FittingModel['defaultModelId'];
  modelName: Schema.FittingModel['modelName'];
  sortOrder: Schema.FittingModel['sortOrder'];
  status: Extract<FittingModelUpdateStatus, 'UPDATE'>;
};

export type DeleteFittingModel = {
  id: Schema.FittingModel['defaultModelId'];
  status: Extract<FittingModelUpdateStatus, 'DELETE'>;
};

export type PatchFittingModelListRequestDto = {
  defaultModels: (UpdateFittingModel | DeleteFittingModel)[];
};
