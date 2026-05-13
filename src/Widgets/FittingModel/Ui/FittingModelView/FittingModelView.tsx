import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { FittingLoadingView } from '@/Widgets/Fitting/Ui';
import { FittingModelUploadLoadingView } from '@/Widgets/FittingModel/Ui/FittingModelUploadLoadingView';

import { usePostFitting } from '@/Features/Fitting/Model';
import { usePostFittingModel } from '@/Features/FittingModel';

import {
  FittingModelImage,
  useFittingModelStore,
} from '@/Entities/FittingModel';

import { FittingModelActionDialog } from '../FittingModelActionDialog';
import { ModelZoomDialog } from '../ModelZoomDialog';

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

  return (
    <div className='bg-grey-08 relative flex h-[18.75rem] w-full justify-center overflow-hidden rounded-[0.375rem] p-[0.5625rem] select-none'>
      <FittingModelActionDialog dialogTriggerClassName='absolute top-2 left-2 z-10' />
      {isPostFittingPending && (
        <FittingLoadingView isLoading={isPostFittingPending} />
      )}
      {isPostFittingModelPending && (
        <FittingModelUploadLoadingView isLoading={isPostFittingModelPending} />
      )}
      {!isPostFittingPending && !isPostFittingModelPending && (
        <FittingModelImage
          src={currentFittingModel.defaultModelUrl}
          imageFileName={currentFittingModel.imageName}
          className='h-[105%] max-w-none translate-y-1 self-center object-contain'
        />
      )}
      {/* TODO: 사이즈 추천 기능 완성 시 추가 */}
      {/* <FittingResultRouteButton /> */}
      <ModelZoomDialog dialogTriggerClassName='absolute top-2 right-2 z-10' />
    </div>
  );
};
