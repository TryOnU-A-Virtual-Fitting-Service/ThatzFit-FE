import { queryOptions } from '@tanstack/react-query';

import { getFittingHistoryList } from './Get';
import { fittingHistoryKeys } from './Key';

export const fittingHistoryQueries = {
  listOptions: () =>
    queryOptions({
      queryKey: fittingHistoryKeys.list(),
      queryFn: getFittingHistoryList,
    }),
};
