import { queryOptions } from '@tanstack/react-query';

import type { GetPluginSetupQuery } from '../Type';

import { getPluginSetup } from './Get';
import { pluginKeys } from './Key';

export const pluginQueries = {
  setupOption: (query: GetPluginSetupQuery) =>
    queryOptions({
      queryKey: pluginKeys.setup(),
      queryFn: () => getPluginSetup(query),
    }),
};
