import { queryOptions } from '@tanstack/react-query';

import { getFittingModelList } from './Get';
import { fittingModelKeys } from './Key';

export const fittingModelQueries = {
  listOptions: () =>
    queryOptions({
      queryKey: fittingModelKeys.list(),
      queryFn: getFittingModelList,
    }),
};
