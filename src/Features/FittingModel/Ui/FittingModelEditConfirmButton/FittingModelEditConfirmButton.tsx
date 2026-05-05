import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

type FittingModelEditConfirmButtonProps = {
  onClick: () => void;
};

export const FittingModelEditConfirmButton = ({
  onClick,
}: FittingModelEditConfirmButtonProps) => {
  const copy = getPluginCopy();

  return (
    <Button
      variant='ghost'
      className='bg-grey-01 hover:bg-grey-02 !grow cursor-pointer text-white hover:text-white'
      onClick={onClick}
    >
      {copy.common.done}
    </Button>
  );
};
