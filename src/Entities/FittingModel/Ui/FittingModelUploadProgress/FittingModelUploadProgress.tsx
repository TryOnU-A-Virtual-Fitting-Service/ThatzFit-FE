import { useEffect, useState } from 'react';

type FittingModelUploadProgressProps = {
  isLoading?: boolean;
};

export const FittingModelUploadProgress = ({
  isLoading = false,
}: FittingModelUploadProgressProps) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 1000 / 60;
    const increment = 100 / (duration / intervalTime);

    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + increment;
        if (next >= 100 || !isLoading) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    });

    return () => clearInterval(interval);
  }, [isLoading]);

  return <span className='text-heading3'>{Math.round(uploadProgress)}%</span>;
};
