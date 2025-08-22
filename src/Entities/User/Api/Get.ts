import { get } from '@/Shared/Model';

import type { GetUserInfoResponseDto } from '../Type';

export const getUserInfo = async () => {
  return get<GetUserInfoResponseDto>('/api/users/me').then((res) => res.json());
};
