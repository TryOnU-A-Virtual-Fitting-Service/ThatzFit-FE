import { patch } from '@/Shared/Model';

import type { PatchFittingModelListRequestDto } from '../Type';

export const patchFittingModelList = async (
  dto: PatchFittingModelListRequestDto,
) => {
  return patch('api/default-model/batch-update', {
    body: JSON.stringify(dto),
  });
};
