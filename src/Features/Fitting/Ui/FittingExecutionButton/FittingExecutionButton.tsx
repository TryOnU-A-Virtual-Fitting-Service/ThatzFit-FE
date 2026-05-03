import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';
import { useToast } from '@/Shared/Model';

import {
  IS_VIRTUAL_FITTING_API_DISABLED,
  VIRTUAL_FITTING_API_DISABLED_MESSAGE,
} from '../../Config';
import { usePostFittingJob } from '../../Model';
import {
  captureDebugError,
  captureDebugInfo,
  getBlobDebugDetails,
  getBlobDebugTraceId,
} from '../../Model/debug';

const FITTING_FAILED_MESSAGE = '피팅에 실패했어요.';

export const FittingExecutionButton = () => {
  const { mutateAsync: postFittingJob, isPending: isFittingJobPending } =
    usePostFittingJob();

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

  useEffect(() => {
    captureDebugInfo(
      getBlobDebugTraceId(capturedClothingImage),
      'dialog.execution_button_render_state',
      {
        capturedBlob: getBlobDebugDetails(capturedClothingImage),
        isFittingJobPending,
      },
    );
  }, [capturedClothingImage, isFittingJobPending]);

  if (!capturedClothingImage) {
    return null;
  }

  const handleClickExecutionButton = () => {
    const debugTraceId = getBlobDebugTraceId(capturedClothingImage);
    captureDebugInfo(debugTraceId, 'dialog.confirm_click', {
      capturedBlob: getBlobDebugDetails(capturedClothingImage),
      isFittingJobPending,
    });

    if (IS_VIRTUAL_FITTING_API_DISABLED) {
      captureDebugInfo(debugTraceId, 'dialog.confirm_skipped_api_disabled');
      setFittingJobId(null);
      setCapturedClothingImage(null);
      setIsFittingDialogOpen(false);
      toast.success(VIRTUAL_FITTING_API_DISABLED_MESSAGE);
      return;
    }

    postFittingJob(debugTraceId, {
      onSuccess: ({ data: { tryOnJobId } }) => {
        captureDebugInfo(debugTraceId, 'dialog.job_created', {
          tryOnJobId,
        });
        captureDebugInfo(debugTraceId, 'dialog.job_id_store_start', {
          tryOnJobId,
        });
        setFittingJobId(tryOnJobId);
      },
      onError: (error) => {
        captureDebugError(debugTraceId, 'dialog.job_create_failed', {
          error,
        });
        toast.error(FITTING_FAILED_MESSAGE);
      },
      onSettled: () => {
        captureDebugInfo(debugTraceId, 'dialog.close_after_job_request');
        setIsFittingDialogOpen(false);
      },
    });
  };

  return (
    <Button
      size='lg'
      className='!grow cursor-pointer'
      onClick={handleClickExecutionButton}
    >
      확인
    </Button>
  );
};
