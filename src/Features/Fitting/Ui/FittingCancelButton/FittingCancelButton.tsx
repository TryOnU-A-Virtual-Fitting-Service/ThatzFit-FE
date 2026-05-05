import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';

import {
  captureDebugInfo,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '../../Model/debug';

export const FittingCancelButton = () => {
  const copy = getPluginCopy();
  const { capturedClothingImage, setIsFittingDialogOpen } = useFittingStore(
    useShallow((state) => ({
      capturedClothingImage: state.capturedClothingImage,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
    })),
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
      {copy.common.cancel}
    </Button>
  );
};
