import { useMutation } from '@tanstack/react-query';

import { postFittingModel } from '../Api';
import type { PostFittingModelRequestDto } from '../Type';

export const usePostFittingModel = () => {
  return useMutation({
    mutationFn: (dto: PostFittingModelRequestDto) => postFittingModel(dto),
  });
};
