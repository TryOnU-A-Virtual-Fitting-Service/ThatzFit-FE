import { useMutation } from '@tanstack/react-query';

import { postFittingJob } from '../Api';

export const usePostFittingJob = () => {
  return useMutation({
    mutationFn: (debugTraceId?: string) => postFittingJob(debugTraceId),
  });
};
