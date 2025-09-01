import { Spinner } from '@/Shared/Ui';

type FittingModelViewLoadingProps = {
  uploadProgress: number;
};

export const FittingModelViewLoading = ({
  uploadProgress,
}: FittingModelViewLoadingProps) => {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
      <Spinner />
      <div className='flex flex-col items-center'>
        <span className='text-body3-medium text-black'>{uploadProgress}%</span>
        <span className='text-body3-medium animate-bounce text-black'>
          모델이 될 준비중...
        </span>
      </div>
    </div>
  );
};
