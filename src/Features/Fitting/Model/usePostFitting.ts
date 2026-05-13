import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { fittingHistoryKeys } from '@/Entities/FittingHistory';
import { useFittingModelStore } from '@/Entities/FittingModel';

import { getPluginCopy } from '@/Shared/Config';
import { useToast } from '@/Shared/Model';

import { postFitting } from '../Api';
import { IS_VIRTUAL_FITTING_API_DISABLED } from '../Config';
import type { PostFittingRequestDto } from '../Type';

import {
  captureDebugError,
  captureDebugInfo,
  getBlobDebugDetails,
  getBlobDebugTraceId,
  summarizeUrl,
} from './debug';

export const usePostFitting = () => {
  const copy = getPluginCopy();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    fittingJobId,
    capturedClothingImage,
    setFittingJobId,
    setCapturedClothingImage,
  } = useFittingStore(
    useShallow((state) => ({
      fittingJobId: state.fittingJobId,
      setFittingJobId: state.setFittingJobId,
      capturedClothingImage: state.capturedClothingImage,
      setCapturedClothingImage: state.setCapturedClothingImage,
    })),
  );

  const { currentFittingModel, fittingModelList, setCurrentFittingModel } =
    useFittingModelStore(
      useShallow((state) => ({
        currentFittingModel: state.currentFittingModel,
        fittingModelList: state.defaultModels,
        setCurrentFittingModel: state.setCurrentFittingModel,
      })),
    );

  const { mutateAsync: executeFitting, isPending } = useMutation({
    mutationFn: (dto: PostFittingRequestDto) => postFitting(dto),
  });

  useEffect(() => {
    captureDebugInfo(
      getBlobDebugTraceId(capturedClothingImage),
      'fitting.effect_check',
      {
        hasFittingJobId: Boolean(fittingJobId),
        hasCapturedClothingImage: Boolean(capturedClothingImage),
        hasCurrentFittingModel: Boolean(currentFittingModel),
        capturedBlob: getBlobDebugDetails(capturedClothingImage),
        currentFittingModel: currentFittingModel
          ? {
              defaultModelId: currentFittingModel.defaultModelId,
              defaultModelUrl: summarizeUrl(
                currentFittingModel.defaultModelUrl,
              ),
              modelName: currentFittingModel.modelName,
            }
          : null,
      },
    );

    if (fittingJobId && capturedClothingImage && currentFittingModel) {
      const debugTraceId = getBlobDebugTraceId(capturedClothingImage);

      if (IS_VIRTUAL_FITTING_API_DISABLED) {
        captureDebugInfo(debugTraceId, 'fitting.execute_skipped_api_disabled', {
          fittingJobId,
        });
        setFittingJobId(null);
        setCapturedClothingImage(null);
        return;
      }

      captureDebugInfo(debugTraceId, 'fitting.effect_conditions_met', {
        fittingJobId,
      });
      const clothingImageFile = new File(
        [capturedClothingImage],
        'capturedClothingImage.png',
        {
          type: 'image/png',
        },
      );

      captureDebugInfo(debugTraceId, 'fitting.execute_start', {
        fittingJobId,
        file: {
          name: clothingImageFile.name,
          size: clothingImageFile.size,
          type: clothingImageFile.type,
        },
      });

      executeFitting(
        {
          request: {
            tryOnJobId: fittingJobId,
            modelUrl: currentFittingModel.defaultModelUrl,
            defaultModelId: currentFittingModel.defaultModelId,
            debugTraceId,
          },
          file: clothingImageFile,
        },
        {
          onSuccess: ({ data }) => {
            captureDebugInfo(debugTraceId, 'fitting.execute_success', {
              tryOnJobId: data.tryOnJobId,
              tryOnResultUrl: summarizeUrl(data.tryOnResultUrl),
              defaultModelId: data.defaultModelId,
              modelName: data.modelName,
            });
            toast.success(copy.fitting.completed);
            queryClient.invalidateQueries({
              queryKey: fittingHistoryKeys.list(),
            });
            setCurrentFittingModel({
              ...currentFittingModel,
              defaultModelUrl: data.tryOnResultUrl,
            });
          },
          onError: (error) => {
            captureDebugError(debugTraceId, 'fitting.execute_failed', {
              error,
            });
            toast.error(
              error instanceof Error ? error.message : copy.fitting.failed,
            );
          },
          onSettled: () => {
            captureDebugInfo(
              debugTraceId,
              'fitting.execute_settled_clear_state',
            );
            setFittingJobId(null);
            setCapturedClothingImage(null);
          },
        },
      );
    }
  }, [
    fittingJobId,
    currentFittingModel,
    capturedClothingImage,
    fittingModelList,
    toast,
    queryClient,
    executeFitting,
    setFittingJobId,
    setCapturedClothingImage,
    setCurrentFittingModel,
    copy,
  ]);

  return { isPending };
};
