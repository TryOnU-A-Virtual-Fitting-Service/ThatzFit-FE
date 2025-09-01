import { Trash2 } from 'lucide-react';

import { Button } from '@/Shared/Components';

type FittingModelDeleteButtonProps = {
  deleteTargetModelId: Schema.FittingModel['defaultModelId'];
  disabled?: boolean;
  handleFittingModelDelete: (fittingModelId: number) => void;
};

export const FittingModelDeleteButton = ({
  deleteTargetModelId,
  disabled = false,
  handleFittingModelDelete,
}: FittingModelDeleteButtonProps) => {
  return (
    <Button
      variant='ghost'
      size='icon'
      className='text-grey-04 h-fit w-fit cursor-pointer'
      onClick={() => handleFittingModelDelete(deleteTargetModelId)}
      disabled={disabled}
    >
      <Trash2 size={12} />
    </Button>
  );
};
