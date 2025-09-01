import { SquarePen } from 'lucide-react';

import {
  FITTING_MODEL_ACTION_MODE,
  type FittingModelActionMode,
} from '@/Features/FittingModel';

import { Button } from '@/Shared/Components';

type FittingModelEditButtonProps = {
  setFittingModelActionMode: (
    fittingModelActionMode: FittingModelActionMode,
  ) => void;
};

export const FittingModelEditButton = ({
  setFittingModelActionMode,
}: FittingModelEditButtonProps) => {
  const handleClickFittingModelEditButton = () => {
    setFittingModelActionMode(FITTING_MODEL_ACTION_MODE.EDIT);
  };

  return (
    <Button
      variant='secondary'
      size='icon'
      className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 h-fit w-fit cursor-pointer bg-white p-1'
      onClick={handleClickFittingModelEditButton}
    >
      <SquarePen />
    </Button>
  );
};
