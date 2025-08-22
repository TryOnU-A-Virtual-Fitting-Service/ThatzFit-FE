import { useMutation } from '@tanstack/react-query';

import { postUserInit } from '../Api';
import type { PostUserInitRequestDto } from '../Type';

export const usePostUserInit = () => {
  return useMutation({
    mutationFn: (dto: PostUserInitRequestDto) => postUserInit(dto),
  });
};
