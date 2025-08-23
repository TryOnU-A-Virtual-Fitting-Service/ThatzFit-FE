export type PostUserInfoRequestDto = {
  uuid: string;
};

export type PostUserInfoResponseDto = {
  defaultModels: Schema.FittingModel[];
  tryOnResults: {
    tryOnResultId: string;
    tryOnResultUrl: string;
  }[];
};
