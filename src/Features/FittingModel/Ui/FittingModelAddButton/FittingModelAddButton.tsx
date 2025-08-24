import type { RefObject } from 'react';
import { SquarePlus } from 'lucide-react';

import { Button } from '@/Shared/Components';

type FittingModelAddButtonProps = {
  fileInputRef?: RefObject<HTMLInputElement>;
};

export const FittingModelAddButton = ({
  fileInputRef,
}: FittingModelAddButtonProps) => {
  const handleClickFittingModel = () => {
    fileInputRef?.current?.click();
  };

  return (
    <Button
      variant='secondary'
      size='icon'
      className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit cursor-pointer bg-white p-1'
      onClick={handleClickFittingModel}
    >
      <SquarePlus />
    </Button>
  );
};
