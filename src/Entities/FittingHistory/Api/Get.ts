import type { GetFittingHistoryListResponseDto } from '@/Entities/FittingHistory/Type';

import { get } from '@/Shared/Model';

export const getFittingHistoryList = async () => {
  return get<GetFittingHistoryListResponseDto>('/api/try-on/results').then(
    (res) => res.json(),
  );
};
