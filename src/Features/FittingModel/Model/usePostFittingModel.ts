import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import {
  fittingModelKeys,
  useFittingModelStore,
} from '@/Entities/FittingModel';
import { usePluginStore } from '@/Entities/Plugin';

import { getPluginCopy, isCustomError } from '@/Shared/Config';
import { useToast } from '@/Shared/Model';

import { postFittingModel } from '../Api';
import type { PostFittingModelRequestDto } from '../Type';

export const usePostFittingModel = () => {
  const copy = getPluginCopy();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    isUploading,
    setFittingModelUploadStatus,
    addedFittingModel,
    setCurrentFittingModel,
  } = useFittingModelStore(
    useShallow((state) => ({
      isUploading: state.fittingModelUploadStatus.isUploading,
      setFittingModelUploadStatus: state.setFittingModelUploadStatus,
      addedFittingModel: state.addedFittingModel,
      setCurrentFittingModel: state.setCurrentFittingModel,
    })),
  );

  const pluginIframe = usePluginStore((state) => state.pluginIframe);

  const { mutate: uploadFittingModel, isPending } = useMutation({
    mutationFn: (dto: PostFittingModelRequestDto) => postFittingModel(dto),
  });

  useEffect(() => {
    if (isUploading && addedFittingModel) {
      setTimeout(() => {
        const iframeDocument = pluginIframe?.contentWindow?.document;
        if (iframeDocument) {
          iframeDocument.body.style.pointerEvents = 'auto';
        }
      }, 0);

      uploadFittingModel(
        {
          file: addedFittingModel.modelImageFile,
        },
        {
          onSuccess: ({ data }) => {
            queryClient.invalidateQueries({
              queryKey: fittingModelKeys.list(),
            });
            setCurrentFittingModel({
              defaultModelUrl: data.imageUrl,
              imageName: data.modelName,
              modelName: data.modelName,
              defaultModelId: data.id,
            });
            toast.success(copy.model.uploadSuccess);
          },
          onError: (error) => {
            if (isCustomError(error) || error instanceof Error) {
              toast.error(error.message);
            }
          },
          onSettled: () => {
            setFittingModelUploadStatus({
              isUploading: false,
            });
          },
        },
      );
    }
  }, [
    isUploading,
    toast,
    addedFittingModel,
    queryClient,
    pluginIframe,
    setCurrentFittingModel,
    setFittingModelUploadStatus,
    uploadFittingModel,
    copy,
  ]);

  return { isPending };
};
