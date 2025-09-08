import { useMutation } from '@tanstack/react-query';

import { postClothesImageDataUrl } from '../Api';
import type { PostClothesImageDataUrlRequestDto } from '../Type';

export const usePostClothesImageDataUrl = () => {
  return useMutation({
    mutationFn: (dto: PostClothesImageDataUrlRequestDto) =>
      postClothesImageDataUrl(dto),
  });
};
