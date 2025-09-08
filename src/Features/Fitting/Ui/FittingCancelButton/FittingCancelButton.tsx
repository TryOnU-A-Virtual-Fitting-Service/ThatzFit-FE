import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';

export const FittingCancelButton = () => {
  const setIsFittingDialogOpen = useFittingStore(
    (state) => state.setIsFittingDialogOpen,
  );

  const handleClickCancelButton = () => {
    setIsFittingDialogOpen(false);
  };

  return (
    <Button
      variant='secondary'
      size='lg'
      className='!grow cursor-pointer'
      onClick={handleClickCancelButton}
    >
      취소
    </Button>
  );
};
