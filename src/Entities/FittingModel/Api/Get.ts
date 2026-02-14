import { get } from '@/Shared/Model';

import type { GetFittingModelListResponseDto } from '../Type';

export const getFittingModelList = async () => {
  return get<GetFittingModelListResponseDto>('/api/v1/default-model/list').then(
    (res) => res.json(),
  );
};
