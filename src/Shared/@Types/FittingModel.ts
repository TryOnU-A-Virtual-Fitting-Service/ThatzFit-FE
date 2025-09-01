declare global {
  namespace Schema {
    type FittingModel = {
      defaultModelId: number;
      defaultModelUrl: string;
      modelName: string;
      sortOrder: number;
      isCustom: boolean;
    };
  }
}

export {};
