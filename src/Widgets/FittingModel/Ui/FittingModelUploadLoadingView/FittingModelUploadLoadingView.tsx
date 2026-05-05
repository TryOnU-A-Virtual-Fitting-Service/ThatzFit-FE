import { FittingModelUploadProgress } from '@/Entities/FittingModel';

import { getPluginCopy } from '@/Shared/Config';
import { LoadingAnimation } from '@/Shared/Ui';

type FittingModelUploadLoadingViewProps = {
  isLoading?: boolean;
};

export const FittingModelUploadLoadingView = ({
  isLoading = false,
}: FittingModelUploadLoadingViewProps) => {
  const copy = getPluginCopy();

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
      <LoadingAnimation />
      <div className='flex flex-col items-center'>
        <FittingModelUploadProgress isLoading={isLoading} />
        <span className='text-body3-medium text-black'>
          {copy.model.uploadLoading}
        </span>
      </div>
    </div>
  );
};
