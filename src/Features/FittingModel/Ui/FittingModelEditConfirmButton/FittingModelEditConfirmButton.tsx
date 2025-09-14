import { Button } from '@/Shared/Components';

type FittingModelEditConfirmButtonProps = {
  onClick: () => void;
};

export const FittingModelEditConfirmButton = ({
  onClick,
}: FittingModelEditConfirmButtonProps) => {
  return (
    <Button
      variant='ghost'
      className='bg-grey-01 hover:bg-grey-02 !grow cursor-pointer text-white hover:text-white'
      onClick={onClick}
    >
      완료
    </Button>
  );
};
