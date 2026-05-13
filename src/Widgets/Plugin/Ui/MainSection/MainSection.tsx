import { FittingHistorySection } from '@/Widgets/FittingHistory';
import { FittingModelView } from '@/Widgets/FittingModel';

import { FittingButton } from '@/Features/Fitting';

export const MainSection = () => {
  return (
    <section className='flex h-full min-h-0 w-full flex-col px-[0.8125rem] pb-1'>
      <FittingModelView />
      <FittingHistorySection />
      <FittingButton />
    </section>
  );
};
