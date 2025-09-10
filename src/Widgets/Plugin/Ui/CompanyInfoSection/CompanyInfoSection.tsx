import { useShallow } from 'zustand/react/shallow';

import { CompanyLogo, CompanySlogan, usePluginStore } from '@/Entities/Plugin';

export const CompanyInfoSection = () => {
  const { logoUrl, sloganUrl } = usePluginStore(
    useShallow((state) => ({
      logoUrl: state.companyLogoUrl,
      sloganUrl: state.companySloganUrl,
    })),
  );
  return (
    <section className='flex h-full w-full flex-col items-center justify-center gap-[0.5625rem]'>
      <CompanyLogo logoUrl={logoUrl} />
      <CompanySlogan sloganUrl={sloganUrl} />
    </section>
  );
};
