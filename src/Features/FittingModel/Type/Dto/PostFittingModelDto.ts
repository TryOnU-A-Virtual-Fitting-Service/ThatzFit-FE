export type PostFittingModelRequestDto = {
  file: File;
};

export type PostFittingModelResponseDto = {
  id: Schema.FittingModel['defaultModelId'];
  modelName: Schema.FittingModel['modelName'];
  imageUrl: Schema.FittingModel['defaultModelUrl'];
  sortOrder: Schema.FittingModel['sortOrder'];
};
