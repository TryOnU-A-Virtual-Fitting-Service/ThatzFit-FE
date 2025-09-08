export type GetUserInfoResponseDto = {
  recentlyUsedModel: {
    defaultModelId: Schema.FittingModel['defaultModelId'];
    defaultModelUrl: Schema.FittingModel['defaultModelUrl'];
    modelName: Schema.FittingModel['modelName'];
    imageName: string;
  };
};
