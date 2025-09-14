import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { useFittingStore } from '@/Entities/Fitting';
import { fittingHistoryKeys } from '@/Entities/FittingHistory';
import { useFittingModelStore } from '@/Entities/FittingModel';

import { useToast } from '@/Shared/Model';

import { postFitting } from '../Api';
import type { PostFittingRequestDto } from '../Type';

const FITTING_FAILED_MESSAGE = '피팅에 실패했어요.';

export const usePostFitting = () => {
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
    if (fittingJobId && capturedClothingImage && currentFittingModel) {
      const clothingImageFile = new File(
        [capturedClothingImage],
        'capturedClothingImage.png',
        {
          type: 'image/png',
        },
      );

      executeFitting(
        {
          request: {
            tryOnJobId: fittingJobId,
            modelUrl: currentFittingModel.defaultModelUrl,
            defaultModelId: currentFittingModel.defaultModelId,
          },
          file: clothingImageFile,
        },
        {
          onSuccess: ({ data }) => {
            toast.success('피팅을 완료했어요.');
            queryClient.invalidateQueries({
              queryKey: fittingHistoryKeys.list(),
            });
            setCurrentFittingModel({
              ...currentFittingModel,
              defaultModelUrl: data.tryOnResultUrl,
            });
          },
          onError: () => {
            toast.error(FITTING_FAILED_MESSAGE);
          },
          onSettled: () => {
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
  ]);

  return { isPending };
};
