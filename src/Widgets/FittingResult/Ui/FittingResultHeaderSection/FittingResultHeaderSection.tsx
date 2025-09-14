import { CompanyInfoSection } from '@/Widgets/Plugin';

import { PreviousButton } from '@/Shared/Ui';

export const FittingResultHeaderSection = () => {
  return (
    <section className='flex h-fit w-full flex-col gap-2.5 pt-4'>
      <CompanyInfoSection />
      <PreviousButton className='ml-3.5 h-5 w-5' />
    </section>
  );
};
