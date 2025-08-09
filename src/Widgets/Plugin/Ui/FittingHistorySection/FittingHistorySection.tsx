import { FittingHistoryInfoTooltip } from '@/Features/Plugin';

export const FittingHistorySection = () => {
  return (
    <section className='mt-4 mb-[0.875rem] flex flex-col gap-1'>
      <div className='flex w-full items-center justify-between'>
        <span className='text-body1'>피팅 히스토리</span>
        <FittingHistoryInfoTooltip />
      </div>
      <div className='bg-grey-08 mt-2 flex h-[3.625rem] w-full items-center rounded-md'>
        <span className='text-body3-regular text-grey-04 w-full text-center'>
          입어본 옷이 없어요. 새로운 옷을 입어볼까요?
        </span>
      </div>
    </section>
  );
};
