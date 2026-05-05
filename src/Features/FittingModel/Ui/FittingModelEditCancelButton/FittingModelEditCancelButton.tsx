import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

type FittingModelEditCancelButtonProps = {
  onClick: () => void;
};

export const FittingModelEditCancelButton = ({
  onClick,
}: FittingModelEditCancelButtonProps) => {
  const copy = getPluginCopy();

  return (
    <Button
      variant='ghost'
      className='bg-grey-08 !grow cursor-pointer'
      onClick={onClick}
    >
      {copy.common.cancel}
    </Button>
  );
};
