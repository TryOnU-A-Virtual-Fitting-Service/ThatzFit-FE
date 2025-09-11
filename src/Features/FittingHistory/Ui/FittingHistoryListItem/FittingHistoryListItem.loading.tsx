import { Skeleton } from '@/Shared/Components';

export const FittingHistoryListItemLoading = () => {
  return (
    <div className='h-10 w-10 shrink-0 rounded-md'>
      <Skeleton className='h-full w-full rounded-md bg-white' />
    </div>
  );
};
