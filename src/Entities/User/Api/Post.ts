import { post } from '@/Shared/Model';

import type { PostUserInfoRequestDto, PostUserInfoResponseDto } from '../Type';

export const postUserInfo = async (dto: PostUserInfoRequestDto) => {
  return post<PostUserInfoResponseDto>(`/api/v1/user/init`, {
    body: JSON.stringify(dto),
  });
};
