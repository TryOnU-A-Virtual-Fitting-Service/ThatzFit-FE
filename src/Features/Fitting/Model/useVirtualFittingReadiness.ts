import { useMutation } from '@tanstack/react-query';

import { getVirtualFittingReadiness } from '../Api';

export const useVirtualFittingReadiness = () => {
  return useMutation({
    mutationFn: (debugTraceId?: string) =>
      getVirtualFittingReadiness(debugTraceId),
  });
};
