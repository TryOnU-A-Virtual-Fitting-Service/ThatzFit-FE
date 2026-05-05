import { getPluginCopy } from '@/Shared/Config';

export const FittingHistoryListEmptyView = () => {
  const copy = getPluginCopy();

  return (
    <div className='bg-grey-08 mt-2 flex h-[3.625rem] w-full items-center rounded-md'>
      <span className='text-body3-regular text-grey-04 w-full text-center'>
        {copy.history.empty}
      </span>
    </div>
  );
};
