import { useLocation, useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';

import { useFittingModelStore } from '@/Entities/FittingModel';

import { Button } from '@/Shared/Components';

export const FittingResultRouteButton = () => {
  const currentFittingModel = useFittingModelStore(
    (state) => state.currentFittingModel,
  );

  const fittingModelList = useFittingModelStore((state) => state.defaultModels);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleRouteToResultPage = () => {
    navigate('./result');
  };

  if (
    fittingModelList.find(
      (model) => model.defaultModelUrl === currentFittingModel.defaultModelUrl,
    ) ||
    pathname.includes('result')
  ) {
    return null;
  }
  return (
    <Button
      size='icon'
      className='text-grey-03 hover:bg-grey-07 hover:text-grey-01 absolute top-2 right-8 h-5 w-5 cursor-pointer rounded-[0.3125rem] bg-white p-1'
      onClick={handleRouteToResultPage}
    >
      <Key className='size-4' />
    </Button>
  );
};
