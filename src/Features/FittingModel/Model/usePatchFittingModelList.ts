import { useMutation } from '@tanstack/react-query';

import { patchFittingModelList } from '../Api';
import type { PatchFittingModelListRequestDto } from '../Type';

export const usePatchFittingModelList = () => {
  return useMutation({
    mutationFn: (dto: PatchFittingModelListRequestDto) =>
      patchFittingModelList(dto),
  });
};
