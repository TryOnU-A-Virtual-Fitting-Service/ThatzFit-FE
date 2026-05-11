import { useQuery } from '@tanstack/react-query';

import { FittingHistoryInfoTooltip } from '@/Features/FittingHistory';

import { fittingHistoryQueries } from '@/Entities/FittingHistory';

import { getPluginCopy } from '@/Shared/Config';

import {
  FittingHistoryList,
  FittingHistoryListEmptyView,
} from '../FittingHistoryList';

export const FittingHistorySection = () => {
  const copy = getPluginCopy();
  const {
    data: fittingHistoryList,
    isLoading,
    isSuccess,
  } = useQuery({
    ...fittingHistoryQueries.listOptions(),
    select: (response) => response.data,
  });

  return (
    <section className='mt-4 mb-[0.875rem] flex w-full flex-col gap-1 select-none'>
      <div className='flex w-full items-center justify-between'>
        <span className='text-body1'>{copy.history.title}</span>
        <FittingHistoryInfoTooltip />
      </div>
      {fittingHistoryList?.tryOnResults.length === 0 ? (
        <FittingHistoryListEmptyView />
      ) : (
        <FittingHistoryList
          fittingHistoryList={fittingHistoryList?.tryOnResults}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      )}
    </section>
  );
};
