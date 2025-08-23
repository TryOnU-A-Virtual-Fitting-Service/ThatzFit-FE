import { useMutation } from '@tanstack/react-query';

import { postUserInfo } from '../Api';
import type { PostUserInfoRequestDto } from '../Type';

export const usePostUserInfo = () => {
  return useMutation({
    mutationFn: (dto: PostUserInfoRequestDto) => postUserInfo(dto),
  });
};
