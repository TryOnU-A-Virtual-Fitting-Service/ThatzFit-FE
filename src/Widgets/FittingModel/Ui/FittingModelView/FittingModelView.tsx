import {
  FittingModelActionDialog,
  ModelZoomDialog,
} from '@/Features/FittingModel';

import { FittingModelImage } from '@/Entities/FittingModel';

export const FittingModelView = () => {
  return (
    <div className='bg-grey-08 relative flex h-[18.75rem] w-full justify-center rounded-[0.375rem] p-[0.5625rem] select-none'>
      <FittingModelActionDialog dialogTriggerClassName='absolute top-2 left-2' />
      <FittingModelImage
        src='https://cdn.thatzfit.com/default/models/slim-korean-male.png'
        imageFileName='default-male-model'
        className='object-contain'
      />
      <ModelZoomDialog dialogTriggerClassName='absolute top-2 right-2' />
    </div>
  );
};
