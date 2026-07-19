declare global {
  namespace Schema {
    type FittingHistory = {
      tryOnJobId: Schema.Fitting['tryOnJobId'];
      tryOnResultUrl: string;
      defaultModelId?: Schema.FittingModel['defaultModelId'] | null;
      modelName?: Schema.FittingModel['modelName'] | null;
    };
  }
}

export {};
