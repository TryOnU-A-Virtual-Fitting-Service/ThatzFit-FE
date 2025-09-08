import { useEffect, useState } from 'react';

type FittingProgressProps = {
  isLoading?: boolean;
};

export const FittingProgress = ({
  isLoading = false,
}: FittingProgressProps) => {
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    const duration = 16000;
    const intervalTime = 1000 / 60;

    const increment = 100 / (duration / intervalTime); // 각 step의 증가량

    setLoadingProgress(0);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + increment;
        if (next >= 100 || !isLoading) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLoading]);

  return <span className='text-heading3'>{Math.round(loadingProgress)}%</span>;
};
