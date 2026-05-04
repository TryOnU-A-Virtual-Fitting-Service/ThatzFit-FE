import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';

import { Button } from '@/Shared/Components';
import { useToast } from '@/Shared/Model';

import { VIRTUAL_FITTING_READINESS_FALLBACK_MESSAGE } from '../../Config';
import { usePostFittingJob, useVirtualFittingReadiness } from '../../Model';
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
    mutateAsync: checkVirtualFittingReadiness,
    isPending: isReadinessPending,
  } = useVirtualFittingReadiness();

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
  const isExecutionPending = isFittingJobPending || isReadinessPending;

  useEffect(() => {
    captureDebugInfo(
      getBlobDebugTraceId(capturedClothingImage),
      'dialog.execution_button_render_state',
      {
        capturedBlob: getBlobDebugDetails(capturedClothingImage),
        isExecutionPending,
      },
    );
  }, [capturedClothingImage, isExecutionPending]);

  if (!capturedClothingImage) {
    return null;
  }

  const handleClickExecutionButton = async () => {
    const debugTraceId = getBlobDebugTraceId(capturedClothingImage);
    captureDebugInfo(debugTraceId, 'dialog.confirm_click', {
      capturedBlob: getBlobDebugDetails(capturedClothingImage),
      isExecutionPending,
    });

    if (isExecutionPending) {
      return;
    }

    try {
      const { data: readiness } =
        await checkVirtualFittingReadiness(debugTraceId);
      captureDebugInfo(debugTraceId, 'dialog.readiness_check_success', {
        ready: readiness.ready,
        paused: readiness.paused,
        provider: readiness.provider,
        reason: readiness.reason,
      });

      if (!readiness.ready) {
        captureDebugInfo(debugTraceId, 'dialog.confirm_skipped_not_ready', {
          reason: readiness.reason,
        });
        setFittingJobId(null);
        setCapturedClothingImage(null);
        setIsFittingDialogOpen(false);
        toast.error(readiness.message);
        return;
      }
    } catch (error) {
      captureDebugError(debugTraceId, 'dialog.readiness_check_failed', {
        error,
      });
      setFittingJobId(null);
      setCapturedClothingImage(null);
      setIsFittingDialogOpen(false);
      toast.error(VIRTUAL_FITTING_READINESS_FALLBACK_MESSAGE);
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
      disabled={isExecutionPending}
    >
      확인
    </Button>
  );
};
