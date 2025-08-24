import {
  FittingModelImage,
  useFittingModelStore,
} from '@/Entities/FittingModel';

import { FittingModelActionDialog } from '../FittingModelActionDialog';
import { ModelZoomDialog } from '../ModelZoomDialog';

export const FittingModelView = () => {
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );

  return (
    <div className='bg-grey-08 relative flex h-[18.75rem] w-full justify-center rounded-[0.375rem] p-[0.5625rem] select-none'>
      <FittingModelActionDialog dialogTriggerClassName='absolute top-2 left-2' />
      <FittingModelImage
        src={currentFittingModel.modelUrl}
        imageFileName={currentFittingModel.imageName}
        className='object-contain'
      />
      <ModelZoomDialog dialogTriggerClassName='absolute top-2 right-2' />
    </div>
  );
};
