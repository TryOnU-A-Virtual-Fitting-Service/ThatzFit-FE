import { useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { FittingClothingCaptureScreen, FittingDialog } from '@/Widgets/Fitting';
import {
  CompanyInfoSection,
  FooterSection,
  MainSection,
} from '@/Widgets/Plugin';

import {
  fittingModelQueries,
  useFittingModelStore,
} from '@/Entities/FittingModel';

import { PluginLayout } from '../PluginLayout';

export const FittingPage = () => {
  const { data: fittingModelList, isSuccess: isFittingModelListSuccess } =
    useSuspenseQuery({
      ...fittingModelQueries.listOptions(),
      select: (response) => response.data,
    });

  const setCurrentFittingModel = useFittingModelStore(
    (state) => state.setCurrentFittingModel,
  );

  useEffect(() => {
    if (isFittingModelListSuccess) {
      setCurrentFittingModel({
        defaultModelUrl: fittingModelList[0].defaultModelUrl,
        imageName: fittingModelList[0].defaultModelUrl.split('/').pop() ?? '',
        modelName: fittingModelList[0].modelName,
        defaultModelId: fittingModelList[0].defaultModelId,
      });
    }
  }, [setCurrentFittingModel, fittingModelList, isFittingModelListSuccess]);

  return (
    <>
      <PluginLayout>
        <PluginLayout.Header>
          <CompanyInfoSection className='pt-4' />
        </PluginLayout.Header>
        <PluginLayout.Main>
          <MainSection />
        </PluginLayout.Main>
        <PluginLayout.Footer>
          <FooterSection />
        </PluginLayout.Footer>
      </PluginLayout>
      <FittingClothingCaptureScreen />
      <FittingDialog />
    </>
  );
};
