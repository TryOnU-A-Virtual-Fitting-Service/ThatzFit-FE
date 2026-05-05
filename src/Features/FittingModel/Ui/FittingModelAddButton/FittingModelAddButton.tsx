import type { RefObject } from 'react';
import { SquarePlus } from 'lucide-react';

import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';
import { useToast } from '@/Shared/Model';

import { FITTING_MODEL_MAX_COUNT } from './FittingModelAddButton.constant';

type FittingModelAddButtonProps = {
  fittingModelCount: number;
  fileInputRef?: RefObject<HTMLInputElement | null>;
};

export const FittingModelAddButton = ({
  fittingModelCount,
  fileInputRef,
}: FittingModelAddButtonProps) => {
  const copy = getPluginCopy();
  const { toast } = useToast();

  const handleClickFittingModel = () => {
    if (fittingModelCount >= FITTING_MODEL_MAX_COUNT) {
      toast.error(copy.model.maxCount(FITTING_MODEL_MAX_COUNT));
      return;
    }
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
