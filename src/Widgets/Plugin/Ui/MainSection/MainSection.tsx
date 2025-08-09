import { FittingButton } from '@/Features/Plugin';

import { FittingHistorySection } from '../FittingHistorySection';
import { FittingModelView } from '../FittingModelView';

export const MainSection = () => {
  return (
    <section className='flex w-full flex-col px-4'>
      <FittingModelView />
      <FittingHistorySection />
      <FittingButton />
    </section>
  );
};
