import { Button } from '@/Shared/Components';

import ThatzfitLandingText from '../../../../../public/assets/Thatfitz_Landing.svg?react';

export const ThatzfitLandingButton = () => {
  return (
    <Button
      variant='ghost'
      className='text-grey-04 hover:text-grey-01! h-[0.9375rem]'
    >
      <ThatzfitLandingText className='size-16' />
    </Button>
  );
};
