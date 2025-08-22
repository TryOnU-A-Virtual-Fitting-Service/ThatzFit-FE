export type GetUserInfoResponseDto = {
  defaultModels: Schema.FittingModel[];
  defaultFitting: {
    tryOnResultIds: string;
    tryOnResultUrl: string;
  };
};
