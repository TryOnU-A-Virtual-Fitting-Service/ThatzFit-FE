declare global {
  namespace Schema {
    type FittingHistory = {
      tryOnJobId: Schema.Fitting['tryOnJobId'];
      tryOnResultUrl: string;
      defaultModelId: Schema.FittingModel['defaultModelId'];
      modelName: Schema.FittingModel['modelName'];
    };
  }
}

export {};
