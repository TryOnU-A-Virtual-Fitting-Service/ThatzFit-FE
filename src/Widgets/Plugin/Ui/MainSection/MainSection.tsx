import { FittingHistorySection } from '@/Widgets/FittingHistory';
import { FittingModelView } from '@/Widgets/FittingModel';

import { FittingButton } from '@/Features/Fitting';

export const MainSection = () => {
  return (
    <section className='flex w-full flex-col px-4'>
      <FittingModelView />
      <FittingHistorySection />
      <FittingButton />
    </section>
  );
};
