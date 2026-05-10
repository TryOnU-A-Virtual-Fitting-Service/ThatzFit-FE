import { useShallow } from 'zustand/react/shallow';

import { CompanyLogo, CompanySlogan, usePluginStore } from '@/Entities/Plugin';

import { cn } from '@/Shared/Lib';

type CompanyInfoSectionProps = {
  className?: string;
};

export const CompanyInfoSection = ({ className }: CompanyInfoSectionProps) => {
  const { logoUrl, sloganUrl } = usePluginStore(
    useShallow((state) => ({
      logoUrl: state.companyLogoUrl,
      sloganUrl: state.companySloganUrl,
    })),
  );
  return (
    <section
      className={cn(
        'flex h-fit w-full flex-col items-center gap-[0.5625rem]',
        className,
      )}
    >
      <CompanyLogo
        logoUrl={logoUrl}
        className='h-[2.125rem] max-w-[8.75rem] object-contain'
      />
      <CompanySlogan
        sloganUrl={sloganUrl}
        className='h-[1.125rem] max-w-[11rem] object-contain'
      />
    </section>
  );
};
