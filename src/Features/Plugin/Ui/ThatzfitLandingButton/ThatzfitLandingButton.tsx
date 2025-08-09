import { Button } from '@/Shared/Components';

export const ThatzfitLandingButton = () => {
  return (
    <Button
      variant='ghost'
      className='text-grey-04 hover:bg-grey-09 hover:text-grey-01 mt-1 h-[0.9375rem] rounded-sm bg-white px-1 py-1.5'
    >
      <span className='text-grey-04 hover:text-grey-01 text-body3'>
        Thatzfit에서 피팅중
      </span>
    </Button>
  );
};
