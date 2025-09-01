export type GetUserInfoResponseDto = {
  recentlyUsedModel: {
    modelUrl: string;
    imageName: string;
    modelName: Schema.FittingModel['modelName'];
  };
};
