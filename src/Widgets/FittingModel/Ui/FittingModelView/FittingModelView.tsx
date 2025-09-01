import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  FittingModelImage,
  useFittingModelStore,
} from '@/Entities/FittingModel';

import { FittingModelActionDialog } from '../FittingModelActionDialog';
import { ModelZoomDialog } from '../ModelZoomDialog';

import { FittingModelViewLoading } from './FittingModelView.loading';

export const FittingModelView = () => {
  const {
    currentFittingModel,
    fittingModelUploadStatus,
    fittingModelList,
    setCurrentFittingModel,
  } = useFittingModelStore(
    useShallow((state) => ({
      currentFittingModel: state.currentFittingModel,
      fittingModelUploadStatus: state.fittingModelUploadStatus,
      fittingModelList: state.defaultModels,
      setCurrentFittingModel: state.setCurrentFittingModel,
    })),
  );

  useEffect(() => {
    const currentSelectedFittingModel = fittingModelList.find(
      (model) => model.defaultModelUrl === currentFittingModel.modelUrl,
    );

    if (
      currentSelectedFittingModel &&
      currentSelectedFittingModel?.modelName !== currentFittingModel.modelName
    ) {
      setCurrentFittingModel({
        ...currentFittingModel,
        modelName: currentSelectedFittingModel?.modelName ?? '',
      });
    }
  }, [fittingModelList, currentFittingModel, setCurrentFittingModel]);

  return (
    <div className='bg-grey-08 relative flex h-[18.75rem] w-full justify-center rounded-[0.375rem] p-[0.5625rem] select-none'>
      <FittingModelActionDialog dialogTriggerClassName='absolute top-2 left-2' />
      {fittingModelUploadStatus.isUploading ? (
        <FittingModelViewLoading
          uploadProgress={fittingModelUploadStatus.uploadProgress}
        />
      ) : (
        <FittingModelImage
          src={currentFittingModel.modelUrl}
          imageFileName={currentFittingModel.imageName}
          className='object-contain'
        />
      )}

      <ModelZoomDialog dialogTriggerClassName='absolute top-2 right-2' />
    </div>
  );
};
