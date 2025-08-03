import MusinsaLogo from '../../../../../public/assets/Musinsa_Logo.svg?react';
import Slogan from '../../../../../public/assets/Slogan.svg?react';

export const CompanyInfoSection = () => {
  return (
    <section className='flex h-full w-full flex-col items-center justify-center gap-[0.5625rem] pt-4'>
      <MusinsaLogo />
      <Slogan />
    </section>
  );
};
