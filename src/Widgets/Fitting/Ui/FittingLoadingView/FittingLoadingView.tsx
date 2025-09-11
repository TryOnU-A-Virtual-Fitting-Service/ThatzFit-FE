import { FittingProgress } from '@/Entities/Fitting';

import { LoadingAnimation } from '@/Shared/Ui';

type FittingLoadingViewProps = {
  isLoading?: boolean;
};

export const FittingLoadingView = ({ isLoading }: FittingLoadingViewProps) => {
  return (
    <div className='flex flex-col items-center justify-center gap-0.5'>
      <LoadingAnimation />
      <div className='flex flex-col items-center'>
        <FittingProgress isLoading={isLoading} />
        <span className='text-body3-medium'>옷 갈아입는 중...</span>
      </div>
    </div>
  );
};
