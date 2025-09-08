import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { FITTING_MODEL_LOADING_MESSAGE } from '@/Widgets/FittingModel/Ui/FittingModelView/FittingModelView.constant';

import { usePostFitting } from '@/Features/Fitting/Model';
import { usePostFittingModel } from '@/Features/FittingModel';

import {
  FittingModelImage,
  useFittingModelStore,
} from '@/Entities/FittingModel';

import { FittingModelActionDialog } from '../FittingModelActionDialog';
import { ModelZoomDialog } from '../ModelZoomDialog';

import { FittingModelViewLoading } from './FittingModelView.loading';

export const FittingModelView = () => {
  const { currentFittingModel, fittingModelList, setCurrentFittingModel } =
    useFittingModelStore(
      useShallow((state) => ({
        currentFittingModel: state.currentFittingModel,
        fittingModelList: state.defaultModels,
        setCurrentFittingModel: state.setCurrentFittingModel,
      })),
    );

  const { isPending: isPostFittingPending } = usePostFitting();
  const { isPending: isPostFittingModelPending } = usePostFittingModel();

  useEffect(() => {
    const currentSelectedFittingModel = fittingModelList.find(
      (model) => model.defaultModelUrl === currentFittingModel.defaultModelUrl,
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

  const loadingText = (() => {
    if (isPostFittingModelPending) {
      return FITTING_MODEL_LOADING_MESSAGE.UPLOAD_MODEL;
    }
    if (isPostFittingPending) {
      return FITTING_MODEL_LOADING_MESSAGE.EXECUTE_FITTING;
    }
    return '';
  })();

  return (
    <div className='bg-grey-08 relative flex h-[18.75rem] w-full justify-center rounded-[0.375rem] p-[0.5625rem] select-none'>
      <FittingModelActionDialog dialogTriggerClassName='absolute top-2 left-2' />
      {isPostFittingModelPending || isPostFittingPending ? (
        <FittingModelViewLoading loadingText={loadingText} />
      ) : (
        <FittingModelImage
          src={currentFittingModel.defaultModelUrl}
          imageFileName={currentFittingModel.imageName}
          className='object-contain'
        />
      )}

      <ModelZoomDialog dialogTriggerClassName='absolute top-2 right-2' />
    </div>
  );
};
