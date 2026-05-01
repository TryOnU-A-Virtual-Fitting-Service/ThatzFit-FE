import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';

export const FittingCancelButton = () => {
  const { setCapturedClothingImage, setIsFittingDialogOpen } = useFittingStore(
    useShallow((state) => ({
      setCapturedClothingImage: state.setCapturedClothingImage,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
    })),
  );

  const handleClickCancelButton = () => {
    setIsFittingDialogOpen(false);
    setCapturedClothingImage(null);
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
