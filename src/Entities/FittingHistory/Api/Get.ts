import type { GetFittingHistoryListResponseDto } from '@/Entities/FittingHistory/Type';

import { get } from '@/Shared/Model';

export const getFittingHistoryList = async () => {
  return get<GetFittingHistoryListResponseDto>(
    '/api/v1/try-on/with-default-model/list',
  ).then((res) => res.json());
};
