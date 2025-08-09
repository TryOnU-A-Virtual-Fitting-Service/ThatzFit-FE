import { Button } from '@/Shared/Components';

interface FittingButtonProps {
  onClick?: () => void;
}

export const FittingButton = ({ onClick }: FittingButtonProps) => {
  return (
    <Button
      className='bg-grey-02 text-body1 hover:text-grey-07 h-8 w-full cursor-pointer rounded-md text-white hover:bg-black'
      onClick={onClick}
    >
      입어보기
    </Button>
  );
};
