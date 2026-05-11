import { FittingHistorySection } from '@/Widgets/FittingHistory';
import { FittingModelView } from '@/Widgets/FittingModel';

import { FittingButton } from '@/Features/Fitting';

export const MainSection = () => {
  return (
    <section className='flex w-full flex-col px-[0.8125rem]'>
      <FittingModelView />
      <FittingHistorySection />
      <FittingButton />
    </section>
  );
};
