import { post } from '@/Shared/Model';

import type { PostUserInitRequestDto, PostUserInitResponseDto } from '../Type';

export const postUserInit = async (dto: PostUserInitRequestDto) => {
  return post<PostUserInitResponseDto>(`/api/users/init`, {
    body: JSON.stringify(dto),
  }).then((res) => res.json());
};
