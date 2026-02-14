import { get } from '@/Shared/Model';

import type { GetUserInfoResponseDto } from '../Type';

export const getUserInfo = async () => {
  return get<GetUserInfoResponseDto>('/api/v1/user/me').then((res) =>
    res.json(),
  );
};
