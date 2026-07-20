import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { fittingHistoryKeys } from '@/Entities/FittingHistory';
import { useFittingModelStore } from '@/Entities/FittingModel';

import { trackProductEvent } from '@/Shared/Analytics';
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

const CAPTURE_FILE_EXTENSION_BY_TYPE: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
const COMPLETION_DISPLAY_MINIMUM_MS = 700;
const RESULT_IMAGE_PRELOAD_TIMEOUT_MS = 5000;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

const preloadResultImage = (src: string) =>
  new Promise<void>((resolve) => {
    const image = new Image();
    const timeoutId = window.setTimeout(
      resolve,
      RESULT_IMAGE_PRELOAD_TIMEOUT_MS,
    );
    const settle = () => {
      window.clearTimeout(timeoutId);
      resolve();
    };

    image.addEventListener('load', settle, { once: true });
    image.addEventListener('error', settle, { once: true });
    image.src = src;
  });

const toCapturedClothingFile = (blob: Blob): File => {
  const type = blob.type || 'image/png';
  const extension = CAPTURE_FILE_EXTENSION_BY_TYPE[type] ?? 'png';

  return new File([blob], `capturedClothingImage.${extension}`, { type });
};

export const usePostFitting = () => {
  const copy = getPluginCopy();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    fittingJobId,
    capturedClothingImage,
    productPageUrl,
    setFittingJobId,
    setCapturedClothingImage,
    setProductPageUrl,
  } = useFittingStore(
    useShallow((state) => ({
      fittingJobId: state.fittingJobId,
      setFittingJobId: state.setFittingJobId,
      capturedClothingImage: state.capturedClothingImage,
      productPageUrl: state.productPageUrl,
      setCapturedClothingImage: state.setCapturedClothingImage,
      setProductPageUrl: state.setProductPageUrl,
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

  const [isResultTransitioning, setIsResultTransitioning] = useState(false);
  const { mutateAsync: executeFitting, isPending: isRequestPending } =
    useMutation({
      mutationFn: (dto: PostFittingRequestDto) => postFitting(dto),
    });

  useEffect(() => {
    captureDebugInfo(
      getBlobDebugTraceId(capturedClothingImage),
      'fitting.effect_check',
      {
        hasFittingRequestId: Boolean(fittingJobId),
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
          fittingRequestId: fittingJobId,
        });
        setFittingJobId(null);
        setCapturedClothingImage(null);
        setProductPageUrl(null);
        return;
      }

      captureDebugInfo(debugTraceId, 'fitting.effect_conditions_met', {
        fittingRequestId: fittingJobId,
      });
      const clothingImageFile = toCapturedClothingFile(capturedClothingImage);
      const requestStartedAt = performance.now();

      captureDebugInfo(debugTraceId, 'fitting.execute_start', {
        fittingRequestId: fittingJobId,
        file: {
          name: clothingImageFile.name,
          size: clothingImageFile.size,
          type: clothingImageFile.type,
        },
      });

      const runFitting = async () => {
        try {
          const { data } = await executeFitting({
            request: {
              modelUrl: currentFittingModel.defaultModelUrl,
              defaultModelId: currentFittingModel.defaultModelId,
              productPageUrl: productPageUrl ?? undefined,
              debugTraceId,
            },
            file: clothingImageFile,
          });

          captureDebugInfo(debugTraceId, 'fitting.execute_success', {
            tryOnJobId: data.tryOnJobId,
            tryOnResultUrl: summarizeUrl(data.tryOnResultUrl),
            defaultModelId: data.defaultModelId,
            modelName: data.modelName,
          });
          setIsResultTransitioning(true);
          await Promise.all([
            wait(COMPLETION_DISPLAY_MINIMUM_MS),
            preloadResultImage(data.tryOnResultUrl),
          ]);

          toast.success(copy.fitting.completed);
          trackProductEvent('virtual_try_on_completed', {
            fitting_request_id: fittingJobId,
            try_on_job_id: data.tryOnJobId,
            default_model_id: data.defaultModelId,
            model_name: data.modelName,
            captured_image_type: clothingImageFile.type || 'unknown',
            captured_image_size_bytes: clothingImageFile.size,
            duration_ms: Math.round(performance.now() - requestStartedAt),
          });
          queryClient.invalidateQueries({
            queryKey: fittingHistoryKeys.list(),
          });
          setCurrentFittingModel({
            ...currentFittingModel,
            defaultModelUrl: data.tryOnResultUrl,
          });
        } catch (error) {
          captureDebugError(debugTraceId, 'fitting.execute_failed', {
            error,
          });
          trackProductEvent('virtual_try_on_failed', {
            fitting_request_id: fittingJobId,
            default_model_id: currentFittingModel.defaultModelId,
            model_name: currentFittingModel.modelName,
            captured_image_type: clothingImageFile.type || 'unknown',
            captured_image_size_bytes: clothingImageFile.size,
            duration_ms: Math.round(performance.now() - requestStartedAt),
            error_message:
              error instanceof Error ? error.message : copy.fitting.failed,
          });
          toast.error(
            error instanceof Error ? error.message : copy.fitting.failed,
          );
        } finally {
          captureDebugInfo(debugTraceId, 'fitting.execute_settled_clear_state');
          setIsResultTransitioning(false);
          setFittingJobId(null);
          setCapturedClothingImage(null);
          setProductPageUrl(null);
        }
      };

      void runFitting();
    }
  }, [
    fittingJobId,
    currentFittingModel,
    capturedClothingImage,
    productPageUrl,
    fittingModelList,
    toast,
    queryClient,
    executeFitting,
    setFittingJobId,
    setCapturedClothingImage,
    setProductPageUrl,
    setCurrentFittingModel,
    copy,
  ]);

  return {
    isFittingLoading: isRequestPending || isResultTransitioning,
    progressPhase: isResultTransitioning
      ? ('complete' as const)
      : ('processing' as const),
  };
};
