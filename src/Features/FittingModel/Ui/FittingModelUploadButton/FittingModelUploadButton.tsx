import { useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { usePostFittingModel } from '@/Features/FittingModel';

import {
  fittingModelKeys,
  useFittingModelStore,
} from '@/Entities/FittingModel';
import { usePluginStore } from '@/Entities/Plugin';

import { Button } from '@/Shared/Components';
import { useToast } from '@/Shared/Model';

type FittingModelUploadButtonProps = {
  setIsFittingModelAddDialogOpen: (
    isFittingModelAddDialogOpen: boolean,
  ) => void;
  setIsModelActionDialogOpen: (isModelActionDialogOpen: boolean) => void;
};

export const FittingModelUploadButton = ({
  setIsFittingModelAddDialogOpen,
  setIsModelActionDialogOpen,
}: FittingModelUploadButtonProps) => {
  const queryClient = useQueryClient();

  const pluginIframe = usePluginStore((state) => state.pluginIframe);

  const { toast } = useToast();

  const {
    addedFittingModel,
    setFittingModelUploadStatus,
    setCurrentFittingModel,
  } = useFittingModelStore(
    useShallow((state) => ({
      addedFittingModel: state.addedFittingModel,
      setFittingModelUploadStatus: state.setFittingModelUploadStatus,
      setCurrentFittingModel: state.setCurrentFittingModel,
    })),
  );

  const { mutateAsync: postFittingModel } = usePostFittingModel();

  const handleClickUploadFittingModel = async () => {
    if (!addedFittingModel) {
      return;
    }

    setIsModelActionDialogOpen(false);
    setIsFittingModelAddDialogOpen(false);
    setFittingModelUploadStatus({ isUploading: true, uploadProgress: 0 });
    // NOTE: shadcn dialog 버그로 인해 body의 pointer-events 초기화 필요
    setTimeout(() => {
      const iframeDocument = pluginIframe?.contentWindow?.document;
      if (iframeDocument) {
        iframeDocument.body.style.pointerEvents = 'auto';
      }
    }, 0);

    // NOTE: xhr 사용으로 인해 onSuccess 대신 try catch 사용
    try {
      const uploadResult = await postFittingModel({
        dto: {
          file: addedFittingModel.modelImageFile,
        },
        updateUploadProgress: (uploadProgress) => {
          setFittingModelUploadStatus({ isUploading: true, uploadProgress });
        },
      });

      queryClient.invalidateQueries({
        queryKey: fittingModelKeys.list(),
      });

      setCurrentFittingModel({
        modelUrl: uploadResult.data.imageUrl,
        imageName: uploadResult.data.modelName,
        modelName: uploadResult.data.modelName,
      });

      toast.success('새로운 모델을 추가했어요.');
    } catch (error) {
      console.error(error);
    } finally {
      setFittingModelUploadStatus({
        isUploading: false,
        uploadProgress: 0,
      });
    }
  };

  return (
    <Button
      variant='default'
      size='lg'
      className='!grow'
      onClick={handleClickUploadFittingModel}
    >
      확인
    </Button>
  );
};
