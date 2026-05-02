import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';

import {
  captureDebugInfo,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '../../Model/debug';

export const FittingCancelButton = () => {
  const { capturedClothingImage, setIsFittingDialogOpen } = useFittingStore(
    (state) => ({
      capturedClothingImage: state.capturedClothingImage,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
    }),
  );

  const handleClickCancelButton = () => {
    captureDebugInfo(
      getBlobDebugTraceId(capturedClothingImage),
      'dialog.cancel_click',
      {
        capturedBlob: getBlobDebugDetails(capturedClothingImage),
      },
    );
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
