import { queryOptions } from '@tanstack/react-query';

import { getUserInfo } from '../Api';

import { userQueryKeys } from './Key';

export const userQueries = {
  userInfoOptions: () =>
    queryOptions({
      queryKey: userQueryKeys.userInfo(),
      queryFn: () => getUserInfo(),
    }),
};
