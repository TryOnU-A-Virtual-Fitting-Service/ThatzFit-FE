import { useEffect, useState } from 'react';

export type FittingProgressPhase = 'processing' | 'complete';

type FittingProgressProps = {
  phase: FittingProgressPhase;
};

export const FittingProgress = ({ phase }: FittingProgressProps) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(1);

  useEffect(() => {
    if (phase === 'complete') {
      setLoadingProgress(100);
      return;
    }

    setLoadingProgress(1);
    const interval = window.setInterval(() => {
      setLoadingProgress((currentProgress) => {
        if (currentProgress >= 99) {
          return 99;
        }

        return currentProgress + 1;
      });
    }, 160);

    return () => window.clearInterval(interval);
  }, [phase]);

  return <span className='text-heading3'>{Math.round(loadingProgress)}%</span>;
};
