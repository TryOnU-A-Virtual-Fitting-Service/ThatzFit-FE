import { memo } from 'react';
import Lottie from 'lottie-react';

import { FittingProgress } from '@/Entities/Fitting';

import fittingLoading from '../../../../../public/assets/loading/fitting-loading.json';

type FittingLoadingViewProps = {
  isLoading?: boolean;
};

const LoadingAnimation = memo(() => {
  return (
    <Lottie animationData={fittingLoading} loop autoPlay className='h-5 w-5' />
  );
});

LoadingAnimation.displayName = 'LoadingAnimation';

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
