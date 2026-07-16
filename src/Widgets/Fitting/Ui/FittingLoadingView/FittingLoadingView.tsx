import { FittingProgress, type FittingProgressPhase } from '@/Entities/Fitting';

import { getPluginCopy } from '@/Shared/Config';
import { LoadingAnimation } from '@/Shared/Ui';

type FittingLoadingViewProps = {
  phase: FittingProgressPhase;
};

export const FittingLoadingView = ({ phase }: FittingLoadingViewProps) => {
  const copy = getPluginCopy();

  return (
    <div className='flex flex-col items-center justify-center gap-0.5'>
      <LoadingAnimation />
      <div className='flex flex-col items-center'>
        <FittingProgress phase={phase} />
        <span className='text-body3-medium'>{copy.fitting.loading}</span>
      </div>
    </div>
  );
};
