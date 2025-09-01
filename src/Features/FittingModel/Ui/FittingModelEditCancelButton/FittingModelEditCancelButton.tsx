import { Button } from '@/Shared/Components';

type FittingModelEditCancelButtonProps = {
  onClick: () => void;
};

export const FittingModelEditCancelButton = ({
  onClick,
}: FittingModelEditCancelButtonProps) => {
  return (
    <Button
      variant='ghost'
      className='bg-grey-08 !grow cursor-pointer'
      onClick={onClick}
    >
      취소
    </Button>
  );
};
