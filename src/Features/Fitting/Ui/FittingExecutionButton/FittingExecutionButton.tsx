import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';
import { getPluginCopy } from '@/Shared/Config';
import { useToast } from '@/Shared/Model';

import {
  getVirtualFittingApiDisabledMessage,
  IS_VIRTUAL_FITTING_API_DISABLED,
} from '../../Config';
import {
  captureDebugInfo,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '../../Model/debug';

export const FittingExecutionButton = () => {
  const copy = getPluginCopy();

  const {
    capturedClothingImage,
    setCapturedClothingImage,
    setIsFittingDialogOpen,
    setFittingJobId,
  } = useFittingStore(
    useShallow((state) => ({
      capturedClothingImage: state.capturedClothingImage,
      setCapturedClothingImage: state.setCapturedClothingImage,
      setIsFittingDialogOpen: state.setIsFittingDialogOpen,
      setFittingJobId: state.setFittingJobId,
    })),
  );

  const { toast } = useToast();

  if (!capturedClothingImage) {
    return null;
  }

  const handleClickExecutionButton = () => {
    const debugTraceId = getBlobDebugTraceId(capturedClothingImage);
    captureDebugInfo(debugTraceId, 'dialog.confirm_click', {
      capturedBlob: getBlobDebugDetails(capturedClothingImage),
      isFittingRequestPending: false,
    });

    if (IS_VIRTUAL_FITTING_API_DISABLED) {
      captureDebugInfo(debugTraceId, 'dialog.confirm_skipped_api_disabled');
      setFittingJobId(null);
      setCapturedClothingImage(null);
      setIsFittingDialogOpen(false);
      toast.success(getVirtualFittingApiDisabledMessage());
      return;
    }

    const fittingRequestId =
      debugTraceId ?? `inline-${Date.now().toString(36)}`;
    captureDebugInfo(
      debugTraceId,
      'dialog.inline_fitting_request_store_start',
      {
        fittingRequestId,
      },
    );
    setFittingJobId(fittingRequestId);
    captureDebugInfo(debugTraceId, 'dialog.close_after_inline_fitting_request');
    setIsFittingDialogOpen(false);
  };

  return (
    <Button
      size='lg'
      className='!grow cursor-pointer'
      onClick={handleClickExecutionButton}
    >
      {copy.common.confirm}
    </Button>
  );
};
