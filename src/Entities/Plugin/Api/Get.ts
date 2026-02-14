import { get } from '@/Shared/Model';

import type { GetPluginSetupQuery, GetPluginSetupResponseDto } from '../Type';

export const getPluginSetup = async (query: GetPluginSetupQuery) => {
  const { url } = query;
  return get<GetPluginSetupResponseDto>(
    `/api/v1/setup/asset/domain?url=${encodeURIComponent(url)}`,
  ).then((res) => res.json());
};
