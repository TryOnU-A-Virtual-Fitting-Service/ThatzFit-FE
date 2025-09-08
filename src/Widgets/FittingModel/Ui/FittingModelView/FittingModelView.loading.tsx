import { Spinner } from '@/Shared/Ui';

type FittingModelViewLoadingProps = {
  loadingText: string;
};

export const FittingModelViewLoading = ({
  loadingText,
}: FittingModelViewLoadingProps) => {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-2'>
      <Spinner />
      <div className='flex flex-col items-center'>
        <span className='text-body3-medium animate-bounce text-black'>
          {loadingText}
        </span>
      </div>
    </div>
  );
};
