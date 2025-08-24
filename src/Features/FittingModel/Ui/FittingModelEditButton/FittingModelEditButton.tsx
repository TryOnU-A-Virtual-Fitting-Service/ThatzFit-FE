import { SquarePen } from 'lucide-react';

import { Button } from '@/Shared/Components';

export const FittingModelEditButton = () => {
  return (
    <Button
      variant='secondary'
      size='icon'
      className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit cursor-pointer bg-white p-1'
    >
      <SquarePen />
    </Button>
  );
};
