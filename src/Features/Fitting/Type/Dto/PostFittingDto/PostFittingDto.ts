export type PostFittingRequestDto = {
  request: {
    tryOnJobId: Schema.Fitting['tryOnJobId'];
    modelUrl: Schema.FittingModel['defaultModelUrl'];
    defaultModelId: Schema.FittingModel['defaultModelId'];
    productPageUrl?: string;
    debugTraceId?: string;
  };
  file: File;
};

export type PostFittingResponseDto = {
  tryOnJobId: Schema.Fitting['tryOnJobId'];
  tryOnResultUrl: Schema.FittingHistory['tryOnResultUrl'];
  defaultModelId: Schema.FittingModel['defaultModelId'];
  modelName: Schema.FittingModel['modelName'];
};
